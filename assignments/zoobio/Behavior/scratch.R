```{r}
links <- list(
  boris      = "https://www.boris.unito.it/",
  zoomonitor = "https://zoomonitor.org/",
  ao         = "https://fosseyfund.github.io/AOToolBox/",
  abp        = "https://research.kent.ac.uk/lprg/software/",
  bot        = "https://www.simontonsoftware.com/BOT",
  ct         = "https://cybertracker.org/"
)
imap(links, \(x, idx) generate_svg(qrcode = qr_code(x), filename = paste0("qr_", idx, ".svg"), show = FALSE))
```

```{r}
apps <- list(
  boris      =   list(name = "BORIS (Behavioral Observation Research Interactive Software)", link = "https://www.boris.unito.it/"),
  zoomonitor =   list(name = "Zoo Monitor"                                                 , link = "https://zoomonitor.org/"),
  ao         =   list(name = "Animal Observer"                                             , link = "https://fosseyfund.github.io/AOToolBox/"),
  abp        =   list(name = "Animal Behaviour Pro"                                        , link = "https://research.kent.ac.uk/lprg/software/"),
  bot        =   list(name = "BOT (Behavioral Observation Tool)"                           , link = "https://www.simontonsoftware.com/BOT"),
  ct         =   list(name = "CyberTracker"                                                , link = "https://cybertracker.org/")
) %>%
  imap(\(x, idx) assign_in(x, "file", paste0("qr_", idx, ".svg"))) %>%
  enframe() %>%
  unnest_wider(value, names_sep = "_") %>%
  select(name = value_name,
         link = value_link,
         file = value_file) %>%
  mutate(file = as.character(file)) %>%
  gt(rowname_col = "name") %>%
  text_transform(
    locations = cells_body(columns = file),
    fn = function(x) {
      local_image(
        filename = file
      )
    })
apps
```



```{r}
map(apps, \(x) generate_svg(qrcode = x$qr, filename = x$file, show = FALSE))
```


```{r}
%>%
  text_transform(locations = cells_body(columns = qr),
                 fn = function(x) { local_image(qr_tempfile(x)) })
apps
```

