# kinship_plots.R
# Functions for creating kinship and pairwise heatmap visualizations using heatmaply

#' Annotate kinship matrix with hover text for mating pair comparisons
#'
#' @param matrix A kinship matrix (usually filtered to living individuals)
#' @param pedigree.living A pedigree object from `pedtools::ped()` for the living population
#' @param studbook A tibble containing metadata for individuals
#'
#' @return A matrix of hover text strings matching dimensions of `matrix`
#' @export
#'
#' @importFrom dplyr arrange
#' @importFrom dplyr filter
#' @importFrom dplyr intersect
#' @importFrom dplyr left_join
#' @importFrom tibble enframe
#' @importFrom dplyr mutate
#' @importFrom dplyr select
#' @importFrom glue glue
annotate_kin_matrix <- function(matrix, pedigree.living, studbook) {
  F_vec <- F_vector(pedigree.living, studbook) %>%
    enframe(name = "ID", value = "F_vec") %>%
    mutate(ID = as.integer(ID))

  living.data <- family_history(pedigree.living, studbook)
  annotate <- living.data %>%
    mutate(ID = as.integer(ID)) %>%
    left_join(F_vec, by = join_by(ID)) %>%
    mutate(hoverText = glue::glue(
      "{LocCurrent}<br>{Age} yrs (Born {DateBirth})<br>"
      , "Mother: {Dam}, Father: {Sire}<br>"
      , "{N_Siblings} Siblings, {N_Children} Offspring, {N_Descendants} Descendants"
    )) %>%
    arrange(ID)

  kinship_btp  <- subset_matrix_living(matrix, studbook)
  text_males   <- intersect(as.character(living.males(studbook)), rownames(kinship_btp))
  text_females <- intersect(as.character(living.females(studbook)), colnames(kinship_btp))

  annotate.m <- annotate %>% filter(Sex == "Male"   & ID %in% text_males)   %>% select(ID, hoverText) %>% arrange(match(ID, text_males))
  annotate.f <- annotate %>% filter(Sex == "Female" & ID %in% text_females) %>% select(ID, hoverText) %>% arrange(match(ID, text_females))

  hover_matrix <- outer(
    annotate.m$hoverText,
    annotate.f$hoverText,
    FUN = function(m_text, f_text) {
      paste0("<br><b>Male:</b><br>", m_text, "<br><br><b>Female:</b><br>", f_text)
    }
  )
  rownames(hover_matrix) <- annotate.m$ID
  colnames(hover_matrix) <- annotate.f$ID
  return(hover_matrix)
}

#' Generate a kinship or relatedness heatmap using heatmaply
#'
#' @param matrix A numeric matrix of pairwise values (e.g., kinship)
#' @param title Title for the heatmap
#' @param key.title Title for the color bar legend
#' @param xlab Optional x-axis label
#' @param ylab Optional y-axis label
#'
#' @return A heatmaply widget
#' @export
#'
#' @importFrom heatmaply heatmaply
#' @importFrom htmlwidgets saveWidget
#' @importFrom paletteer paletteer_d
#' @importFrom stringr str_remove_all
matrix.heatmap <- function(matrix, title, key.title, xlab = "Females", ylab = "Males") {
  filename <- paste0("heatmap_", stringr::str_remove_all(title, "\\s"), ".html")

  plot <- heatmaply::heatmaply(
    matrix,
    dendrogram       = "none",
    main             = title,
    scale            = "none",
    colors           = paletteer::paletteer_d(colors$div),
    margins          = c(60, 100, 40, 20),
    grid_color       = "white",
    grid_width       = 0.00001,
    label_format_fun = function(value) round(value, digits = 3),
    titleX           = TRUE,
    hide_colorbar    = FALSE,
    key.title        = key.title,
    branches_lwd     = 0.1,
    fontsize_row     = 10,
    fontsize_col     = 10,
    labCol           = colnames(matrix),
    labRow           = rownames(matrix),
    heatmap_layers   = theme(axis.line = element_blank())
  )
  htmlwidgets::saveWidget(plot, filename)
  return(plot)
}

#' Subset a full kinship matrix to include only living males vs. living females
#'
#' @param matrix A symmetric kinship matrix
#' @param studbook A tibble with metadata for all individuals
#'
#' @return A matrix with rows = males, cols = females, both alive
#' @export
#'
#' @importFrom dplyr intersect
subset_matrix_living <- function(matrix, studbook) {
  living_males   <- intersect(as.character(living.males(studbook)), rownames(matrix))
  living_females <- intersect(as.character(living.females(studbook)), colnames(matrix))
  matrix[living_males, living_females]
}
