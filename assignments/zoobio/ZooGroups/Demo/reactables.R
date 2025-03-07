ID <- function(df) {
  colDef(
    header = tippy("ID", tooltip = "Studbook ID color-coded by sex (maroon = F, blue = M, green = Undetermined)"),
    maxWidth = 80,
    cell = color_tiles(
      data       = df,
      color_ref  = "color",
      box_shadow = TRUE,
      bold_text  = TRUE
    )
  )
}

Status <- function() {
  colDef(header = tippy("Status", tooltip = "Alive or Deceased"),
         maxWidth = 100,
         style    = JS("function(rowInfo, column, state) {
                        const firstSorted = state.sorted[0]
                        if (!firstSorted || firstSorted.id === 'Status') {
                          const prevRow = state.pageRows[rowInfo.viewIndex - 1]
                          if (prevRow && rowInfo.values['Status'] === prevRow['Status']) {
                            return { visibility: 'hidden' }
                          }
                        }
                      }")
  )
}

Birth_Date <- function(df) {
  colDef(header   = tippy("Birthdate", tooltip = "Date of birth (captive-born) or capture (wild-born)"),
         maxWidth = 200,
         cell     = color_tiles(
           data                = df,
           colors              = paletteer_d(colors$seq),
           opacity             = 0.4,
           color_by            = "yr_birth",
           brighten_text_color = "black",
           box_shadow          = TRUE,
           number_fmt          = label_date_short()
           )
         )
}

Last_Date <- function(df) {
  colDef(header = tippy("Last Date", tooltip = "Last transfer date (Alive) or date of death (Deceased)"),
         cell = color_tiles(
           data       = df,
           colors     =  paletteer_d(colors$seq),
           opacity    = 0.4,
           color_by   = "yr_last",
           brighten_text_color = "black",
           box_shadow = TRUE,
           number_fmt = label_date_short()
         ), maxWidth = 200)
}

Birth_Location <- function(df) {
  colDef(header = tippy("Born",
                        tooltip = "Location of birth (captive-born) or capture (wild-born)"),
         maxWidth     = 200,
         cell         = color_tiles(
           data       = df,
           color_by   = "birth_loc_num",
           colors     = paletteer_d(colors$rand),
           box_shadow = TRUE
         )
  )
}

Last_Location <- function(df) {
  colDef(header = tippy("Last Location",
                        tooltip = "Current institution (Alive) or institution at time of death (Deceased)"),
         maxWidth = 150,
         cell         = color_tiles(
           data       = df,
           color_by   = "last_loc_num",
           colors     = paletteer_d(colors$rand),
           box_shadow = TRUE
         )
  )
}


Age <- function(df) {
  colDef(header = tippy("Age", tooltip = "Now (Alive) or at time of death (Deceased)"),
         maxWidth = 50,
         cell = color_tiles(
           data       = df,
           colors     =  paletteer_d(colors$seq),
           opacity    = 0.4,
           brighten_text_color = "black",
           box_shadow = TRUE
           )
         )
}

Sire <- function(df) {
  colDef(header = tippy("Father", tooltip = "Studbook ID of Sire (0 if wildborn or unknown)"),
         maxWidth = 80,
         cell = color_tiles(
           data       = df,
           colors     = colors$sire,
           opacity    = 0.6,
           brighten_text_color = "black",
           box_shadow = TRUE
         )
  )
}

Dam <- function(df) {
  colDef(header = tippy("Mother", tooltip = "Studbook ID of Dam (0 if wildborn or unknown)"),
         maxWidth = 80,
         cell = color_tiles(
           data       = df,
           colors     = colors$dam,
           opacity    = 0.6,
           brighten_text_color = "black",
           box_shadow = TRUE
         )
  )
}

Rel_Contribution <- function(df) {
  colDef(header = tippy("Relative Contribution",
                        tooltip = "Individual's contribution to living population relative to total founder representation in current population"),
         cell = data_bars(
           data = df,
           text_position = "outside-base",
           fill_color = paletteer_d(colors$seq),
           number_fmt = label_percent(),
           background = "white",
           box_shadow = TRUE
         ), maxWidth = 200)
}

studbook.cols <- function(df) {
list(
  Status            = Status(),
  ID                = ID(df),
  Birth_Location    = Birth_Location(df),
  Birth_Date        = Birth_Date(df),
  Age               = Age(df),
  Last_Date         = Last_Date(df),
  Last_Location     = Last_Location(df),
  Sire              = Sire(df),
  Dam               = Dam(df),
  Sex               = colDef(show = FALSE),
  color             = colDef(show = FALSE),
  yr_birth          = colDef(show = FALSE),
  yr_last           = colDef(show = FALSE),
  birth_loc_num     = colDef(show = FALSE),
  last_loc_num      = colDef(show = FALSE)
  )
}

founder.cols <- function(df) {
  list(
    ID                = ID(df),
    Birth_Location    = Birth_Location(df),
    Birth_Date        = Birth_Date(df),
    Age_Death         = Age(df),
    Death             = Last_Date(df),
    Last_Location     = Last_Location(df),
    Rel_Contribution  = Rel_Contribution(df),
    Sex               = colDef(show = FALSE),
    color             = colDef(show = FALSE),
    yr_birth          = colDef(show = FALSE),
    yr_last           = colDef(show = FALSE),
    birth_loc_num     = colDef(show = FALSE),
    last_loc_num      = colDef(show = FALSE)
  )
}


studbook.react <- function(df, cols, ...) {
  df %>%
    reactable(
      theme               = flatly(),
      height              = 700,
      sortable            = TRUE,
      resizable           = TRUE,
      filterable          = TRUE,
      defaultExpanded     = TRUE,
      defaultPageSize     = 20,
      showPageSizeOptions = TRUE,
      highlight           = TRUE,
      columns             = cols,
      ...
    )
}

