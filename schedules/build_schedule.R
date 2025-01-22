weeks <- term_weeks(term$start, course$days)

agenda_other <- list(
  Exams   = as.list(compact(map_depth(weeks, 1, \(x) keep(x, names(x) %in% names(exams))))),
  NoClass = as.list(compact(map_depth(weeks, 1, \(x) keep(x, x %in% c(holidays, cancelled)))))
)

agenda_themes <- enframe(themes, name = "Theme", value = "Agenda") %>%
                  unnest_longer(Agenda, values_to = "Agenda")

reading_schedule <- enframe_schedule(readings, "Reading") %>%
  unnest_longer(Reading, values_to = "Reading_Title", indices_to = "file_key")


schedule <- weeks %>%
  map_depth(1, \(x) discard(x, names(x) %in% names(simplify_nested(agenda_other)))) %>%
  discard_at(17) %>% compact()   %>%
  enframe_schedule(values_to = "Date") %>%
  full_join(enframe_schedule(topics, values_to = "Topic"), by = join_by(Week, Day, day_wk, Format)) %>%
  mutate(Agenda = as.character(Topic), .keep = "unused") %>%
  bind_rows(enframe_schedule(agenda_other$Exams  , values_to = "Date", agenda = "Exam"),
            enframe_schedule(agenda_other$NoClass, values_to = "Date", agenda = "No Class")) %>%
  left_join(agenda_themes, by = join_by(Agenda)) %>%
  format_schedule() %>%
  left_join(reading_schedule, by = join_by(Week, Day, Format)) %>%
  select(-day_wk) %>%
  mutate(Reading_Title = if_else(is.na(Reading_Title), "None or TBA", Reading_Title),
         file_key      = if_else(is.na(file_key)     , "None or TBA", file_key)) %>%
  mutate(Theme = case_when(Theme == "Other" & row_number() == 1 ~ "Foundations",
                           Theme == "Other" & lag(Theme) == "Other" ~ lead(Theme),
                           Theme == "Other" & row_number() != 1 ~ lag(Theme),
                           .default = Theme))

