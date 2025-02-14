weeks <- term_weeks(term$start, course$days)

agenda_other <- list(
  Exams   = as.list(compact(map_depth(weeks, 1, \(x) keep(x, names(x) %in% names(exams))))),
  NoClass = as.list(compact(map_depth(weeks, 1, \(x) keep(x, x %in% c(holidays, cancelled)))))
)

agenda_themes <- enframe(themes, name = "Theme", value = "Agenda") %>%
                  unnest_longer(Agenda, values_to = "Agenda")

reading_schedule <- enframe_schedule(readings, "Reading") %>%
  unnest_longer(Reading, values_to = "Reading_Title", indices_to = "key") %>%
  mutate(key = str_replace_all(key, ":", " - "))

slides_schedule <- enframe_schedule(slides, "Slides") %>% select(Day, Slides)


special_agenda <- enframe_schedule(specials, "Event") %>%
  mutate(Day = as.character(Day)) %>%
  select(Day, Event)

lab_schedule <- enframe(labs, name = "Week", value = "Exercise") %>%
  unnest_longer(Exercise,
                values_to  = "lab_link",
                indices_to = "Exercise") %>%
  mutate(Day      = as.character(str_glue("{Week}", "b")),
         Exercise = as.character(Exercise), lab_link = as.character(lab_link)) %>%
  select(Day, Exercise, lab_link)


schedule <- weeks %>%
  map_depth(1, \(x) discard(x, names(x) %in% names(simplify_nested(agenda_other)))) %>%
  discard_at(17) %>% compact() %>%
  enframe_schedule(values_to = "Date") %>%
  full_join(enframe_schedule(topics, values_to = "Topic"), by = join_by(Week, Day, day_wk, Format)) %>%
  mutate(Agenda = as.character(Topic), .keep = "unused") %>%
  bind_rows(enframe_schedule(agenda_other$Exams  , values_to = "Date", agenda = "Exam"),
            enframe_schedule(agenda_other$NoClass, values_to = "Date", agenda = "No Class")) %>%
  left_join(agenda_themes   , by = join_by(Agenda)) %>%
  format_schedule() %>%
  left_join(reading_schedule, by = join_by(Week, Day, Format)) %>%
  left_join(special_agenda  , by = join_by(Day)) %>%
  select(-day_wk) %>%
  left_join(slides_schedule, by = join_by(Day)) %>%
  left_join(lab_schedule   , by = join_by(Day)) %>%
  mutate(Theme = if_else(Theme == "Other", NA, Theme)) %>%
  fill(Theme, .direction = "up") %>%
  fill(Theme, .direction = "down") %>%
  mutate(Week = str_glue("Week ", "{Week}"),
         Link = if_else(
           str_detect(key, "\\w+\\d{4}"),
           str_glue(course$readings, "{key}", ".pdf"),
           NA)) %>%
  mutate(Agenda = if_else(Format == "Lab" & Agenda != "No Class", Exercise, Agenda),
         Slides = if_else(Format == "Lab", lab_link, Slides)) %>%
  select(-c("Exercise", "lab_link"))

