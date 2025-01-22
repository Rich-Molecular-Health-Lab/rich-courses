head_fill     <- c("#4C525EFF")
head_text     <- c("#FFFFFF")
exam_fill     <- c("#A26B3AFF")
exam_text     <- c("#FFFFFF")
no_class_fill <- c("#80848EFF")
no_class_text <- c("#FFFFFF")
lab_fill      <- c("#BFC8D3FF")
lab_text      <- c("#000000")
lecture_fill  <- c("#D8C0B6FF")
lecture_text  <- c("#000000")
week_fill     <- c("#D5CFCAFF")
week_text     <- c("#000000")


gt_calendar <- schedule %>%
  mutate(Week = str_glue("Week ", "{Week}")) %>%
  mutate(Reading_Link = if_else(str_detect(Reading_Title, "None or TBA"), "",
    paste0("[", course$readings$links, file_key, ".pdf]"))) %>%
  select(Date, Start, End, Format, Agenda, Reading = Reading_Title, Reading_Link, file_key, Theme, Week, Day) %>%
  gt(groupname_col       = c("Week", "Theme")
  ) %>%
  opt_table_lines(extent = "none") %>%
  fmt_datetime(columns = "Start",
               date_style = "MEd",
               time_style = "hm",
               tz = "American/Central") %>%
  fmt_url(columns = "Reading_Link",
          label = "Download PDF",
          as_button = TRUE,
          button_fill = "#AFA099FF",
          button_width = px(80)) %>%
  cols_hide(c("Day", "Date", "file_key", "End")) %>%
  cols_label(Start = "Day and Time",
             Reading = "Assigned Reading",
             Reading_Link = "") %>%
  tab_style(style =
              cell_text(weight    = "bold",
                        transform = "uppercase",
                        size      = "large"),
            locations =
              cells_body(rows    = Format == "Exam",
                         columns = c("Theme", "Agenda"))) %>%
  tab_header(title   =
               paste0("Current Schedule for ", course$title, " - ", term$name),
             subtitle =
               paste0("Last updated on ", today())
             ) %>%
  tab_footnote("Check back weekly, as I will update this online version as we adjust our pace and plans",
               locations = cells_title(groups = "subtitle")) %>%
  tab_style(style = list(
    cell_text(stretch   = "condensed",
              weight    = "bold",
              transform = "uppercase")
  ),
  locations = cells_body(columns = "Agenda", rows = Agenda == "No Class")
  ) %>%
  tab_style(style = list(
    cell_fill(color     = no_class_fill, alpha = 0.7),
    cell_text(color     = no_class_text)
    ),
    locations = cells_body(rows = Agenda == "No Class")
    ) %>%
  tab_style(style = list(
    cell_text(stretch   = "condensed",
              weight    = "bold",
              transform = "uppercase")
  ),
  locations = cells_body(columns = "Agenda", rows = Agenda == "Exam")
  ) %>%
  tab_style(style = list(
    cell_fill(color     = exam_fill, alpha = 0.7),
    cell_text(color     = exam_text)
  ),
  locations = cells_body(rows = Agenda == "Exam")
  ) %>%
  tab_style(style = list(
    cell_text(color     = lecture_text),
    cell_fill(color     = lecture_fill, alpha = 0.2)
  ),
  locations = cells_body(rows = Format == "Lecture" & Agenda != "Exam")
  ) %>%
  tab_style(style = list(
    cell_text(stretch   = "condensed",
              transform = "uppercase",
              weight    = "bold")
  ),
  locations = cells_body(rows = Format == "Lab", columns = c("Format"))
  ) %>%
  tab_style(style = list(
    cell_text(color     = lab_text),
    cell_fill(color     = lab_fill, alpha = 0.5)
  ),
  locations = cells_body(rows = Format == "Lab" & Agenda != "No Class")
  ) %>%
  tab_style(style = cell_borders(sides = "top", weight = px(0.5)),
            locations = cells_body()) %>%
  tab_style(style = list(
    cell_text(stretch   = "expanded",
              style     = "oblique",
              weight    = "bold",
              transform = "uppercase",
              color     = week_text),
    cell_fill(color     = week_fill, alpha = 0.7),
    cell_borders(sides = "top", weight = px(2))
  ),
  locations = cells_row_groups()
  ) %>%
  tab_style(style = cell_borders(sides = "top", weight = px(0.5)),
            locations = cells_body()) %>%
  tab_style(style = list(
    cell_text(stretch   = "condensed",
              align     = "left",
              weight    = "bold",
              transform = "uppercase",
              color     = head_text),
    cell_fill(color     = head_fill, alpha = 0.7),
    cell_borders(sides = "top", weight = px(2))
  ),
  locations = cells_column_labels()
  ) %>%
  tab_style(style = list(
    cell_text(size      = "large",
              align     = "left",
              weight    = "bold",
              color     = head_text),
    cell_fill(color     = head_fill, alpha = 0.7),
    cell_borders(sides = "top", weight = px(2))
  ),
  locations = cells_title(groups = "title")
  ) %>%
  tab_style(style = list(
    cell_text(size      = "x-small",
              align     = "left",
              style     = "oblique",
              color     = head_text),
    cell_fill(color     = head_fill, alpha = 0.7),
    cell_borders(sides = "top", style = "hidden")
  ),
  locations = cells_title(groups = "subtitle")
  ) %>%
  cols_width(
    Start ~ px(200),
    Reading ~ px(400),
    Reading_Link ~ px(100),
    Agenda ~ px(250)
  )


