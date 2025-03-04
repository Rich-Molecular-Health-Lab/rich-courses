subset_twins <- function(studbook, pedigree) {
  studbook %>%
    filter(Sire > 0 & Dam > 0) %>%
    group_by(Sire, Dam, Birth_Date) %>%
    filter(n() == 2) %>%
    summarise(
      id1 = first(ID),
      id2 = last(ID),
      .groups = "drop"
    ) %>%
    mutate(code = 2) %>%
    select(id1, id2, code) %>%
    filter(
        id1 %in% founders(pedigree) |
        id1 %in% nonfounders(pedigree) |
        id2 %in% founders(pedigree) |
        id2 %in% nonfounders(pedigree)
    )
}

twins_vector <- function(df) {
  c(df$id1, df$id2) %>%
    unique()
}

get_biggest_ped <- function(pedigree) {
  keep(pedigree, \(x) pedsize(x) == max(pedsize(pedigree)))
}

get_minor_peds <- function(pedigree) {
  discard(pedigree, \(x) pedsize(x) == max(pedsize(pedigree)))
}