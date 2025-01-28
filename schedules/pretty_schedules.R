head_fill      <- c("#4C525EFF")
exam_fill      <- c("#A26B3AFF")
no_class_fill  <- c("#80848EFF")
lab_fill       <- c("#BFC8D3FF")
lecture_fill   <- c("#D8C0B6FF")
week_fill      <- c("#D5CFCAFF")
button_fill    <- c("#AFA099FF")
button_outline <- c("#715843FF")

week_text      <- c("#000000")
lecture_text   <- c("#000000")
lab_text       <- c("#000000")
no_class_text  <- c("#FFFFFF")
exam_text      <- c("#FFFFFF")
head_text      <- c("#FFFFFF")


gt_schedule <- schedule  %>%
  select(Date,
         Start,
         End,
         Format,
         Agenda,
         Slides,
         Event,
         Reading = Reading_Title,
         key,
         Link,
         Theme,
         Week,
         Day) %>%
  gt(groupname_col = c("Week", "Theme")) %>%
  opt_table_lines(extent = "none") %>%
  fmt_datetime(columns    = "Start",
               date_style = "MEd",
               time_style = "hm",
               tz         = "American/Central") %>%
  cols_hide(c("Day", "Date", "End")) %>%
  cols_label(Start  = "Day and Time",
             Event  = "",
             Slides = "") %>%
  fmt_url(columns        = Slides,
          rows           = !is.na(Slides) & Format != "Lab",
          label          = fontawesome::fa(name           = "file-powerpoint",
                                           height         = "1.5em",
                                           vertical_align = "0em"),
          color          = lecture_text) %>%
  fmt_url(columns        = Slides,
          rows           = !is.na(Slides) & Format == "Lab",
          label          = fontawesome::fa(name           = "file-pen",
                                           height         = "1.5em",
                                           vertical_align = "0em"),
          color          = lecture_text) %>%
  sub_missing(columns = "Slides" , missing_text = " ") %>%
  sub_missing(columns = "Reading", missing_text = "-") %>%
  tab_style(style = cell_text(weight    = "bold",
                              stretch   = "condensed",
                              align     = "left"),
            locations = cells_body(columns = "Event")) %>%
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
    cell_text(style = "italic")
  ),
  locations = cells_body(columns = "Agenda", rows = Agenda != "No Class" & Agenda != "Exam")
  ) %>%
  tab_style(style = list(
    cell_text(size = "small")
  ),
  locations = cells_body(columns = "Start")
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
  locations = cells_body(rows    = Format == "Lab",
                         columns = c("Format"))
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
    cell_text(size      = "small",
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
  )

schedule_conbio <- gt_schedule %>%
  cols_hide(c("Reading", "Format", "Link", "Event")) %>%
  sub_missing(columns = "key", missing_text = "-") %>%
  cols_label(key = "Text Pages") %>%
  cols_align("left") %>%
  cols_width(
    Start        ~ px(200),
    Agenda       ~ px(300)
  ) %>%
  tab_footnote("Required text: Conservation Biology by Cardinale, Primack and Murdoch (October 2019, 1st ed.). ISBN: 9781605357140. If you prefer a hardcopy version, you must opt-out of the online charge on canvas by the end of Week 2.",
               locations = cells_column_labels(columns = "key"))

schedule_zoobio <- gt_schedule %>%
  cols_label(Reading = "Reading Title", Link = "Reading Link") %>%
  sub_missing(columns = "Link", missing_text = "-") %>%
  sub_missing(columns = "Event", missing_text = "") %>%
  fmt_url(columns        = "Link",
          rows           = Link != "-",
          label          = from_column("key", na_value = "-"),
          as_button      = TRUE,
          button_fill    = button_fill,
          button_outline = button_outline
          ) %>%
  cols_hide("key") %>%
  cols_width(
    Start        ~ px(200),
    Format       ~ px(150),
    Agenda       ~ px(200),
    Event        ~ px(250),
    Reading      ~ px(400),
    Link         ~ px(150)
  ) %>%
  cols_align("left")


gt_calendar <- list(
  conbio = schedule_conbio,
  zoobio = schedule_zoobio
)

gt_calendar <- gt_calendar[[paste0(params$course)]]
