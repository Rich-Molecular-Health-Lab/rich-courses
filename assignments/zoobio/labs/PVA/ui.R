ui <- fluidPage(
  titlePanel("Population Viability, Kinship, & Interactive Pedigree"),

  sidebarLayout(
    sidebarPanel(
      fileInput("file", "Upload Studbook (Excel file)", accept = c(".xls", ".xlsx")),
      actionButton("process", "Process Studbook Data"),
      hr(),

      # Kinship Matrix and Pedigree Analysis
      selectInput("select_individual", "Select Individual for Pedigree:", choices = NULL),
      actionButton("plot_pedigree", "Plot Pedigree"),
      actionButton("show_kinship", "Show Kinship Matrix"),
      downloadButton("download_kinship", "Download Kinship Matrix"),

      # Selection for Transfers
      selectInput("transfer_individual", "Select Individual for Transfer:", choices = NULL),
      actionButton("confirm_transfer", "Confirm Transfer"),

      # Breeding Pair Recommendations
      actionButton("generate_pairs", "Generate Breeding Pairs"),
      downloadButton("download_pairs", "Download Breeding Pairs")
    ),

    mainPanel(
      tabsetPanel(
        tabPanel("PVA Simulation", plotOutput("pva_plot"), verbatimTextOutput("summary_text")),
        tabPanel("Studbook Data", DTOutput("studbook_preview")),
        tabPanel("Kinship Matrix", DTOutput("kinship_matrix")),
        tabPanel("Pedigree Visualization", plotlyOutput("pedigree_plot")),
        tabPanel("Breeding Recommendations", DTOutput("breeding_pairs")),
        tabPanel("Individual Selection", DTOutput("selected_individuals"))
      )
    )
  )
)