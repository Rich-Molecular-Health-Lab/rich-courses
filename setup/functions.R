term_weeks <- function(start, days) {
  list <- as.list(
    seq.Date(
      from       = ymd(start),
      by         = "day",
      length.out = (17*7))) %>%
    set_names(rep(c("Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"), times = 17)) %>%
    split(ceiling(seq_along(.) / 7)) %>%
    map_depth(1, \(x) keep(x, names(x) %in% days)) %>%
    imap(\(x, idx) set_names(x, ~ paste0(idx, letters[seq_along(.)])))

  return(list)
}

simplify_nested <- function(list) {
  list2 <- list_flatten(list, name_spec = "{inner}") %>%
    list_flatten(name_spec = "{inner}")
  return(list2)
}


enframe_schedule <- function(list, values_to, agenda = NULL) {
  tbl <- list  %>%
    enframe(name = "Week", value = "Days") %>%
    unnest_longer(Days, values_to = values_to, indices_to = "Day") %>%
    mutate(day_wk = factor(str_remove_all(Day, "\\d"), levels = course$dayid)) %>%
    mutate(Format = fct_recode(day_wk, !!!course$mtgs),
           Week   = as.integer(Week),
           Agenda = agenda)
  return(tbl)
}

format_schedule <- function(tibble) {
  tbl <- tibble %>%
    mutate(Start = if_else(Week == 17, hm(as.character(course$time$final)),
      hm(as.character(fct_recode(day_wk, !!!course$time$start)))),
           End   = if_else(Week == 17, (hm(as.character(course$time$final)) + hours(2)),
      hm(as.character(fct_recode(day_wk, !!!course$time$end))))) %>%
    mutate(
      Start = make_datetime(year   = year(Date),
                            month  = month(Date),
                            day    = day(Date),
                            hour   = hour(Start),
                            min    = minute(Start), tz = "America/Chicago"),
      End = make_datetime(year   = year(Date),
                          month  = month(Date),
                          day    = day(Date),
                          hour   = hour(End),
                          min    = minute(End), tz = "America/Chicago")) %>%
    select(Theme, Week, Date, Day, Format, Agenda, Start, End) %>%
    arrange(Date)
  return(tbl)
}

link_reading <- function(file_key) {
  download_link(
    link = paste0(course$readings$links, file_key, ".pdf"),
    button_label = "Download PDF",
    button_type = "danger",
    has_icon = TRUE,
    icon = "fa fa-save",
    self_contained = FALSE
  )
}




