source(templates$syllabus_tables)

learning.outcomes <- slos[[paste0(params$course)]] %>%
  gt(rowname_col = "Level") %>%
  cols_label(Outcome ~ "Students will be able to...") %>%
  tab_stubhead(label = "Level") %>%
  opt_table_lines(extent = "none") %>%
  tab_style(style = list(
    cell_fill(color    = "#84697FFF"),
    cell_text(size     = "large",
              color    = "#E8EADFFF",
              weight   = "bolder",
              align    = "left"),
    cell_borders(sides = c("top", "bottom"))),
    locations = list(cells_column_labels(), cells_stubhead())) %>%
  tab_style(style = list(
    cell_fill(color    = "#84697F40"),
    cell_text(
      weight   = "bold",
      align    = "left")),
    locations = cells_stub()) %>%
  tab_style(style = list(
    cell_fill(color    = "#84697F40"),
    cell_text(
      align    = "left")),
    locations = cells_body()) %>%
  tab_header(title = "Learning Objectives") %>%
  tab_style(style = list(
    cell_text(size   = "x-large",
              align  = "left",
              weight = "bolder")),
    locations = cells_title()) %>%
  cols_width(stub()        ~ px(300),
             Outcome       ~ px(500))
gtsave(learning.outcomes, course$slos$html)
gtsave(learning.outcomes, course$slos$png)

gt_grade_breakdown <- grade_breakdown %>%
  gt(rowname_col = "Format") %>%
  tab_stubhead(label = "Format") %>%
  cols_label(Points_each   ~ "Points",
             Count         ~ "Count",
             N_dropped     ~ "Drops",
             Points_total  ~ "Total",
             Percent_total ~ "% Total") %>%
  fmt_percent(columns  = Percent_total,
              decimals = 0) %>%
  opt_table_lines(extent = "none") %>%
  tab_style(style = list(cell_borders(color   = "#43475BFF",
                                      sides   = c("top", "bottom"),
                                      style   = "double"),
                         cell_text(stretch = "ultra-condensed",
                                   size    = "small",
                                   weight  = "bold",
                                   style   = "oblique",
                                   align   = "right")),
            locations = list(cells_stubhead(), cells_column_labels())) %>%
  tab_style(style = list(cell_fill(color   = "#E8EADFFF"),
                         cell_borders(sides = "bottom",
                                      color = "#43475BFF",
                                      style = "double"),
                         cell_text(align   = "right",
                                   weight  = "bold",
                                   size    = "large")),
            locations = list(cells_stub(), cells_body(columns = Percent_total))) %>%
  tab_style(style = list(cell_fill(color   = "#E8EADFFF"),
                         cell_borders(sides = "bottom",
                                      color = "#43475BFF",
                                      style = "double"),
                         cell_text(align   = "right",
                                   size    = "large")),
            locations = cells_body(columns = !Percent_total)) %>%
  tab_footnote(md(
    "These assignments will focus on specialized skills or involve in-class activities. They will be due at the start of class on the deadline and submitted through Canvas."
  ), locations = cells_stub(rows = Format == "Assignments")) %>%
  tab_footnote(md(
    "These are short quizzes given at the start of class to assess your preparation for the week's topic."
  ), locations = cells_stub(rows = Format == "Quizzes")) %>%
  tab_footnote(md(
    "Number (if any) of lowest scores that will automatically be dropped from your final grade"
  ), locations = cells_column_labels(columns = N_dropped)) %>%
  tab_footnote(md(
    "You may use hard copy notes/materials for all exams, but not electronic devices/resources."
  ), locations = cells_stub(rows = Format == "Exams")) %>%
  tab_style(style     = cell_text(size = "small"),
            locations = cells_footnotes()) %>%
  cols_width(stub()        ~ px(120),
             Points_each   ~ px(85),
             Count         ~ px(85),
             N_dropped     ~ px(85),
             Points_total  ~ px(85),
             Percent_total ~ px(100))

gtsave(gt_grade_breakdown, course$grade_breakdown$html)
gtsave(gt_grade_breakdown, course$grade_breakdown$png)

quiz.rubric <-  quiz_table %>%
  gt(rowname_col = "Score") %>%
  opt_table_lines("none") %>%
  tab_header(title = "Quiz Rubric", subtitle = "The assessment system will be broad, so each quiz will only recieve a 0, 1, 2, or 3 as an assessment of the student's basic preparation level for the class.") %>%
  tab_stubhead("Score") %>%
  cols_label(Standard ~ "Standard Met by Response") %>%
  tab_style(style = list(cell_fill(color  = "#CBB593FF"),
                         cell_borders(sides = c("top", "bottom")),
                         cell_text(color  = "#43475BFF",
                                   weight = "bold",
                                   size   = "large",
                                   align  = "left",
                                   stretch = "condensed")),
            locations = list(cells_column_labels(), cells_stubhead())) %>%
  tab_style(style = list(
    cell_fill(color = "#CBB593FF"),
    cell_borders(sides = c("top", "bottom"),
                 color = "#43475BFF"),
    cell_text(color  = "#43475BFF",
              size = "x-large",
              align  = "left",
              weight = "bolder")),
    locations = cells_title(groups = "title")) %>%
  tab_style(style = list(
    cell_fill(color = "#CBB59340"),
    cell_text(align = "left",
              color = "#43475BFF")),
    locations = list(cells_title(groups = "subtitle"), cells_source_notes())) %>%
  tab_style(style = list(cell_fill(color = "#CBB59340"),
                         cell_text(color  = "#43475BFF"),
                         cell_borders(sides = "bottom",
                                      color = "#CBB593FF"),
                         cell_text(align = "left")),
            locations = cells_body()) %>%
  tab_style(style = list(cell_fill(color  = "#CBB59340"),
                         cell_borders(sides = "bottom",
                                      color = "#CBB593FF"),
                         cell_text(color  = "#43475BFF",
                                   align  = "center",
                                   size   = "large",
                                   weight = "bold")),
            locations = cells_stub())
gtsave(quiz.rubric, course$quiz_rubric$html)
gtsave(quiz.rubric, course$quiz_rubric$png)


class.culture <- culture_table %>%
  gt(rowname_col = "Icon", groupname_col = "Value") %>%
  opt_table_lines(extent = "none") %>%
  tab_header(title = "Classroom Culture", subtitle = "The following three values form the foundation of my classroom culture and expectations:") %>%

  tab_style(style     = list(cell_text(size   = "x-large",
                                       align  = "left",
                                       weight = "bold",
                                       v_align = "bottom")),
            locations = cells_title(groups    = "title")) %>%
  tab_style(style     = list(cell_text(style   = "italic",
                                       align   = "left",
                                       v_align = "bottom")),
            locations = cells_title(groups    = "subtitle")) %>%

  tab_style(style     = list(
    cell_fill(color    = "#C48329FF"),
    cell_borders(sides = "top",
                 color = "black",
                 weight = px(3),
                 style = "double"),
    cell_text(weight    = "bold",
              color     = "white",
              transform = "uppercase",
              size      = "large",
              stretch   = "expanded",
              style     = "oblique")),
    locations = cells_row_groups()) %>%

  tab_style(style = cell_fill(color = "#514A2E40"),
            locations = cells_body(rows = Icon == "circle-check")) %>%

  tab_style(style = cell_fill(color = "#8E411540"),
            locations = cells_body(rows = Icon == "ban")) %>%

  tab_style(style     = list(cell_text(weight   = "bold"),
                             cell_borders(sides = "bottom")),
            locations = cells_column_labels()) %>%

  cols_align(align = "left") %>%

  fmt_icon(columns = stub(),
           rows         = Icon == "circle-check",
           height       = "1em",
           fill_color   = "#514A2EFF") %>%
  fmt_icon(columns = stub(),
           rows         = Icon == "ban",
           height       = "1em",
           fill_color   = "#8E4115FF") %>%

  tab_style(style = list(cell_fill(color = "#514A2E40"),
                         cell_text(weight = "bolder")),
            locations = cells_stub(rows = Icon == "circle-check")) %>%

  tab_style(style = list(cell_fill(color = "#8E411540"),
                         cell_text(weight = "bolder")),
            locations = cells_stub(rows = Icon == "ban")) %>%
  cols_label(Rule  ~ "")

gtsave(class.culture, templates$class_culture$html)
gtsave(class.culture, templates$class_culture$png)

necessary.resources <- resources %>%
  gt(rowname_col = "Image") %>%
  tab_options(column_labels.hidden = TRUE) %>%
  fmt_image(columns = stub()) %>%
  fmt_url(columns = "Link", label = from_column("Resource")) %>%
  cols_hide("Resource") %>%
  opt_table_lines(extent = "none") %>%

  tab_style(style = list(
    cell_fill(color    = "#E8EADF40"),
    cell_text(v_align = "middle",
              align   = "left")),
    locations = list(cells_body(), cells_stub())) %>%

  tab_header(title = "Summary of Required Course Materials") %>%

  tab_style(style = list(
    cell_text(size   = "x-large",
              align  = "left",
              weight = "bolder")),
    locations = cells_title()) %>%
  cols_width(stub()   ~ px(50),
             Link     ~ px(300),
             Comment  ~ px(400))


gtsave(necessary.resources, course$resources$png)

source(templates$syllabus_cards)

