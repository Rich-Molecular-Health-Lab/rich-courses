# pedigree_matches.R
# Focused visualization of pairwise matches in pedigrees using visNetwork

#' Subset pedigree network to visualize match lineage
#'
#' @param pedigree.living A pedigree object for the living population
#' @param pair A character vector of two individual IDs (male, female)
#' @param studbook A tibble containing metadata for the full population
#'
#' @return A visNetwork object showing related individuals and lineage paths
#' @export
#'
#' @importFrom dplyr anti_join
#' @importFrom dplyr bind_rows
#' @importFrom dplyr case_when
#' @importFrom dplyr distinct
#' @importFrom dplyr filter
#' @importFrom purrr list_assign
#' @importFrom dplyr mutate
#' @importFrom dplyr pull
#' @importFrom dplyr setdiff
#' @importFrom dplyr union
#' @importFrom glue glue
#' @importFrom pedtools unrelated
#' @importFrom purrr map2
#' @importFrom verbalisr verbalise
#' @importFrom visNetwork addFontAwesome
#' @importFrom visNetwork visInteraction
#' @importFrom visNetwork visNetwork
#' @importFrom visNetwork visNodes
subset_network_btp <- function(pedigree.living, pair, studbook) {
  male   <- pair[1]
  female <- pair[2]

  edges <- pedigree_edges(pedigree.living, studbook) %>% distinct()
  nodes <- pedigree_nodes(pedigree.living, studbook) %>% distinct()
  result <- verbalise(pedigree.living, ids = pair)

  related.pair <- setdiff(
    pedigree.living$ID,
    union(unrelated(pedigree.living, male), unrelated(pedigree.living, female))
  )

  # Highlight paths connecting proposed pair
  connections <- edges %>%
    filter(to %in% c(pair, result[[1]]$v1, result[[1]]$v2)) %>%
    pull(from) %>%
    unique()

  paths <- edges %>%
    filter(to %in% union(related.pair, pair) | from %in% union(related.pair, pair)) %>%
    filter(to %in% c(pair, result[[1]]$v1, result[[1]]$v2, connections)) %>%
    mutate(color = colors$emph, shadow = TRUE, width = 3)

  pair.edges <- edges %>%
    filter(to %in% union(related.pair, pair) | from %in% union(related.pair, pair)) %>%
    anti_join(paths, by = c("from", "to")) %>%
    bind_rows(paths) %>%
    distinct()

  node.ids <- unique(c(pair.edges$from, pair.edges$to))

  # Styling logic
  style_icons <- function(icon, group) {
    if (group %in% c("match.m", "match.f")) {
      list_assign(icon, size = 55)
    } else if (group == "match.anc") {
      list_assign(icon, size = 45)
    } else {
      icon
    }
  }

  style_font <- function(font, group) {
    if (group %in% c("match.m", "match.f", "match.anc")) {
      list_assign(font, size = 18, background = colors$emph)
    } else if (group %in% c("match.rel.m", "match.rel.f")) {
      list_assign(font, size = 14)
    } else {
      font
    }
  }

  style_color <- function(group) {
    if (group %in% c("match.m", "match.f", "match.anc")) {
      list(background = colors$emph, border = "#000000")
    } else {
      NULL
    }
  }

  pair.nodes <- nodes %>%
    filter(id %in% node.ids) %>%
    mutate(
      label = case_when(
        id == male   ~ "Male Partner",
        id == female ~ "Female Partner",
        id %in% result[[1]]$anc ~ "Shared Ancestor",
        TRUE ~ label
      ),
      group = case_when(
        id == male   ~ "match.m",
        id == female ~ "match.f",
        id %in% result[[1]]$anc ~ "match.anc",
        id %in% result[[1]]$v1  ~ "match.rel.m",
        id %in% result[[1]]$v2  ~ "match.rel.f",
        TRUE ~ group
      ),
      icon  = map2(icon, group, style_icons),
      font  = map2(font, group, style_font),
      color = map(group, style_color),
      borderWidth = case_when(
        group %in% c("match.m", "match.f")     ~ 3,
        group %in% c("match.rel.m", "match.rel.f") ~ 1.5,
        group == "match.anc"                     ~ 2,
        TRUE                                      ~ 1
      )
    ) %>%
    distinct()

  subtitle <- glue::glue(
    "{male} & {female} are {result[[1]]$rel}<br>Path Connecting Pair: {result[[1]]$path}"
  )

  visNetwork(pair.nodes, pair.edges, width = "100%", height = "700px",
             main = "Relatives of Proposed Match", submain = subtitle) %>%
    addFontAwesome(version = "5.13.0") %>%
    visNodes(shadow = TRUE, fixed = list(x = FALSE, y = FALSE)) %>%
    visInteraction(dragNodes = TRUE, dragView = TRUE)
}
