here::i_am("assignments/zoobio/labs/PVA/app.R")

global              <- config::get(config = "default")
templates           <- config::get(config = "templates")
term                <- config::get(config = "S25")
course              <- config::get(config = "zoobio")
github              <- config::get(config = "github")

source(here::here(global$packages))
source(here(global$conflicts))
source(here(global$functions))
source(here(global$inputs))

source(here("assignments/zoobio/labs/PVA/ui.R"))
source(here("assignments/zoobio/labs/PVA/server.R"))

# Run the application
shinyApp(ui = ui, server = server)