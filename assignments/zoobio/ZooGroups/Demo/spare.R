```{r}
studbook.kin <- studbook %>%
  mutate(sex_num = if_else(sex_num == 0, 3, sex_num),
         Status = if_else(Status == "Alive", 0, 1))

ped.kin <- pedigree(
  id     = studbook.kin$ID,
  dadid  = studbook.kin$Sire,
  momid  = studbook.kin$Dam,
  sex    = studbook.kin$sex_num,
  status = studbook.kin$Status
) %>% as.data.frame()
```
