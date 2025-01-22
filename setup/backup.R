finals <- keep_at(weeks, 17) %>%
  enframe(name = "Week", value = "Days") %>%
  unnest_longer(Days, values_to = "Date", indices_to = "Day") %>%
  mutate(Format = "Final Exam",
         Week   = as.numeric(Week)) %>%
  mutate(Format = factor(Format, levels = course$mtgs),
         Day    = factor(Day   , levels = course$dayid)) %>%
  filter(Day == course$final)

gaps <- weeks %>% keep_depth(no_class) %>%
  enframe_schedule() %>%
  format_schedule(format = "No Class", course$mtgs, course$dayid)

finals <- keep_at(weeks, 17) %>%
  enframe_schedule() %>%
  format_schedule(format = "Final Exam", course$mtgs, course$dayid) %>%
  filter(Day == course$final)

meetings <- weeks %>%
  discard_at(17) %>%
  discard_depth(no_class) %>%
  enframe_schedule() %>%
  format_schedule(format = fct_recode(Day, !!!course$mtgs), course$mtgs, course$dayid) %>%
  mutate(Day = factor(Day, levels = course$dayid)) %>%
  mutate(Format = fct_recode(Day, !!!course$mtgs),
         Start = hm(as.character(fct_recode(Day, !!!course$time$start))),
         End   = hm(as.character(fct_recode(Day, !!!course$time$end)))) %>%
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
                        min    = minute(End), tz = "America/Chicago"),
    Week = as.integer(Week)) %>%
  select(Week, Date, Day, Format, Start, End) %>%
  full_join(gaps  , by = join_by(Week, Date, Day, Format)) %>%
  full_join(finals, by = join_by(Week, Date, Day, Format)) %>%
  arrange(Date)

meetings <- weeks  %>%
  discard_at(17) %>%
  map_depth(1, \(x) discard(x, x %in% no_class)) %>%
  enframe(name = "Week", value = "Days") %>%
  unnest_longer(Days, values_to = "Date", indices_to = "Day") %>%
  relocate(Week, Date, Day) %>%
  arrange(Date) %>%
  mutate(Day = factor(Day, levels = course$dayid)) %>%
  mutate(Format = fct_recode(Day, !!!course$mtgs),
         Start = hm(as.character(fct_recode(Day, !!!course$time$start))),
         End   = hm(as.character(fct_recode(Day, !!!course$time$end)))) %>%
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
                        min    = minute(End), tz = "America/Chicago"),
    Week = as.integer(Week)) %>%
  select(Week, Date, Day, Format, Start, End) %>%
  full_join(gaps  , by = join_by(Week, Date, Day, Format)) %>%
  full_join(finals, by = join_by(Week, Date, Day, Format)) %>%
  arrange(Date)

discard_depth <- function(list, discard) {
  list2 <- list %>%
    map_depth(1, \(x) discard(x, x %in% discard)) %>%
    compact()

  return(list2)
}

keep_depth <- function(list, keep) {
  list2 <- list %>%
    map_depth(1, \(x) keep(x, x %in% keep)) %>%
    compact()

  return(list2)
}


mutate(
  Week = if_else(row_number() > 1 & Week == lag(Week), "", as.character(Week))
) %>%
