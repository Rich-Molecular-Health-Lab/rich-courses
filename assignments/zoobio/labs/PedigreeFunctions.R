list_ids <- function(studbook) {
  studbook %>% distinct(ID) %>% map(\(x) as.list(x)) %>% list_flatten(name_spec = "")
}

list_singletons <- function(pedigree) {
  keep(pedigree, \(x) pedsize(x) <= 1) %>% map_depth(., 1, \(x) as.list(x[["ID"]])) %>% list_flatten(name_spec = "")
}

related_ids <- function(pedigree) {
  keep(pedigree, \(x) pedsize(x) > 1)  %>% map_depth(., 1, \(x) as.list(x[["ID"]])) %>% list_flatten(name_spec = "")
}

list_families <- function(pedigree) {
  keep(pedigree, \(x) pedsize(x) > 1)  %>% map_depth(., 1, \(x) as.list(x[["ID"]])) %>% list_flatten(name_spec = "")
}

fills_sex <- list(
  "#6699CCFF" = males,
  "#AA4499FF" = females,
  "#117733FF" = sex.unknown
)

draw_pedigree <- function(pedigree) {
  list(pedigree,
       cex      = 0.5,
       labs     = NULL,
       deceased = deceased,
       fill     = fills_sex,
       col      = "black")
}
