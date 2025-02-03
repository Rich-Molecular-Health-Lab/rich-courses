here::i_am("setup/setup.R")

source(here::here(global$packages))
source(here::here(global$conflicts))
source(here::here(global$functions))
source(here::here(global$inputs))

opts_chunk$set(message = FALSE,
               warning = FALSE,
               echo    = FALSE,
               include = TRUE,
               eval    = TRUE,
               comment = "")
