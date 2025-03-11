missing_sire_ids <- setdiff(
  unique(studbook$Sire[!is.na(studbook$Sire) & studbook$Sire != "0"]),
  studbook$ID
)

missing_dam_ids <- setdiff(
  unique(studbook$Dam[!is.na(studbook$Dam) & studbook$Dam != "0"]),
  studbook$ID
)

new_sire_rows <- studbook %>%
  filter(Sire %in% missing_sire_ids) %>%
  group_by(Sire) %>%
  slice_head(n = 1) %>%
  ungroup() %>%
  mutate(
    ID            = Sire,
    Sex           = "Male",
    Last_Date     = Birth_Date,
    Last_Location = Birth_Location
  ) %>%
  mutate(
    Sire           = "0",
    Dam            = "0",
    Status         = "Deceased",
    Age            = params$first_birth,
    Birth_Date     = Last_Date - years(params$first_birth),
    Birth_Location = NA,
    yr_birth       = year(Last_Date) - params$first_birth,
    yr_last        = year(Last_Date)
  ) %>%
  select(names(studbook))

new_dam_rows <- studbook %>%
  filter(Dam %in% missing_dam_ids) %>%
  group_by(Dam) %>%
  slice_head(n = 1) %>%
  ungroup() %>%
  mutate(
    ID            = Dam,
    Sex           = "Female",
    Last_Date     = Birth_Date,
    Last_Location = Birth_Location
  ) %>%
  mutate(
    Sire           = "0",
    Dam            = "0",
    Status         = "Deceased",
    Age            = params$first_birth,
    Birth_Date     = Last_Date - years(params$first_birth),
    Birth_Location = NA,
    yr_birth       = year(Last_Date) - params$first_birth,
    yr_last        = year(Last_Date)
  ) %>%
  select(names(studbook))


studbook_filled <- bind_rows(studbook, new_sire_rows, new_dam_rows)

studbook_filled <- studbook_filled %>% arrange(ID)

studbook <- studbook_filled