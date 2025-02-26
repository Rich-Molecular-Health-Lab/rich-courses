read_studbook_current <- function(file) {
  read.csv(file, header = T) %>%
    mutate(across(where(is.character), ~ na_if(., "")),
           across(where(is.character), ~ str_trim(.)),
           across(where(is.character), ~ str_remove_all(., "\n")),
           Sex = if_else(Sex == "Female" | Sex == "Male", Sex, "Undetermined"),
           Event_Location = str_remove_all(Location, "[^\\w]"),
           Event_Date   = dmy(str_extract(Event_Date, "\\d+/\\w+/\\d+"))) %>%
    mutate(
      Sire = as.integer(Sire),
      Dam  = as.integer(Dam),
      ID   = as.integer(ID))  %>%
    mutate(Birth_Date     = if_else(str_detect(Event_Type, "Birth"), Event_Date, NA),
           Birth_Location = if_else(str_detect(Event_Type, "Birth"), Event_Location, NA),
           status         = "alive") %>%
    fill(ID) %>%
    group_by(ID) %>%
    fill(Current_Location,
         ID_Local,
         Sex             ,
         status          ,
         Sire            ,
         Dam             ,
         Birth_Type      ,
         Birth_Date      ,
         Event_Type      ,
         Event_Date      ,
         Event_Location  ,
         Birth_Location) %>%
    ungroup()  %>%
    select(
      ID           ,
      Current_Location,
      Sex       ,
      status     ,
      Birth_Date   ,
      Sire   ,
      Dam,
      Birth_Type     ,
      Event_Type     ,
      Event_Location ,
      Event_Date ,
      Birth_Location
    )
}

read_studbook_historic <- function(file) {
  read.csv(file, header = T) %>%
    mutate(across(where(is.character), ~ na_if(., "")),
           across(where(is.character), ~ str_trim(.)),
           across(where(is.character), ~ str_remove_all(., "\n")),
           Sex      = if_else(Sex == "Female" | Sex == "Male", Sex, "Undetermined"),
           Event_Location = str_remove_all(Location, "[^\\w]"),
           Event_Date   = dmy(str_extract(Date, "\\d+/\\w+/\\d+")),
           status         = "deceased")  %>%
    mutate(
      Sire = as.integer(Sire),
      Dam  = as.integer(Dam),
      ID   = as.integer(ID))  %>%
    mutate(Death_Date     = if_else(str_detect(Event_Type, "Death"), Event_Date, NA),
           Death_Location = if_else(str_detect(Event_Type, "Death"), Event_Location, NA),
           Birth_Location = if_else(str_detect(Event_Type, "Birth"), Event_Location, NA),
           Birth_Date     = if_else(str_detect(Event_Type, "Birth"), Event_Date, NA),
           Capture_Date   = if_else(str_detect(Event_Type, "Capture"), Event_Date, NA)) %>%
    fill(ID) %>%
    group_by(ID) %>%
    fill(Current_Location,
         Sex             ,
         Sire            ,
         Dam             ,
         Birth_Type,
         Death_Date,
         Death_Location,
         Birth_Location,
         Birth_Date    ,
         Capture_Date  )  %>%
    ungroup() %>%
    select(
      ID           ,
      Current_Location,
      Sex       ,
      status       ,
      Birth_Date   ,
      Sire   ,
      Dam,
      Birth_Type     ,
      Event_Type     ,
      Event_Location ,
      Event_Date ,
      Death_Date,
      Death_Location,
      Birth_Location,
      Capture_Date
    )
}

sub_missing_parents <- function(df) {
  df %>%
    bind_rows(tibble(ID               = c(setdiff(unique(df$Sire), df$ID)),
                     Current_Location = NA_character_,
                     Sex              = 1,
                     status           = "Undetermined",
                     Sire             = NA_integer_,
                     Dam              = NA_integer_,
                     Birth_Type       = "Undetermined",
                     Birth_Date       = as.Date(NA),
                     Birth_Location   = "Undetermined",
                     Death_Date       = as.Date(NA),
                     Death_Location   = "Undetermined",
                     Capture_Date     = as.Date(NA)
    ),
    tibble(ID               = c(setdiff(unique(df$Dam), df$ID)),
           Current_Location = NA_character_,
           Sex              = 2,
           status           = "Undetermined",
           Sire             = NA_integer_,
           Dam              = NA_integer_,
           Birth_Type       = "Undetermined",
           Birth_Date       = as.Date(NA),
           Birth_Location   = "Undetermined",
           Death_Date       = as.Date(NA),
           Death_Location   = "Undetermined",
           Capture_Date     = as.Date(NA)
    )
    )  %>%
    filter(!is.na(ID))
}

format_studbook <- function(df, sex_unknown) {
  df   %>%
    filter(!is.na(Event_Date)) %>%
    arrange(ID, Event_Date) %>%
    group_by(ID) %>%
    mutate(Event_Order = row_number()) %>%
    slice(max(Event_Order)) %>%
    ungroup() %>%
    mutate(Sex = case_when(
      Sex == "Male"   ~ 1,
      Sex == "Female" ~ 2,
      .default = sex_unknown
    )) %>%
    select(ID,
           Current_Location,
           status,
           Sex,
           Sire,
           Dam,
           Birth_Type,
           Birth_Date,
           Birth_Location,
           Death_Date,
           Death_Location,
           Capture_Date  ) %>%
    arrange(ID) %>%
    filter(!(str_detect(Birth_Type, "Captive") & (is.na(Sire) | is.na(Dam)))) %>%
    filter(!is.na(ID)) %>%
    mutate(Age = case_when(status == "alive"                         ~ year(today())    - year(Birth_Date),
                           status == "deceased" & !is.na(Birth_Date) ~ year(Death_Date) - year(Birth_Date),
                           status == "deceased" & is.na(Birth_Date) & !is.na(Capture_Date) ~ year(Death_Date) - year(Capture_Date),
                           .default = 0))
}
