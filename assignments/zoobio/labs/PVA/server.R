server <- function(input, output, session) {

  # Load necessary libraries
  library(pedtools)   # For pedigree structure and kinship calculations
  library(dplyr)
  library(readxl)
  library(DT)
  library(writexl)

  # Reactive object to store uploaded data
  studbook_data <- reactiveVal(NULL)
  kinship_matrix <- reactiveVal(NULL)

  # Process uploaded studbook data
  observeEvent(input$process, {
    req(input$file)
    data <- read_excel(input$file$datapath)
    colnames(data) <- tolower(colnames(data))  # Standardize column names

    # Ensure required columns exist
    required_columns <- c("studbook_id", "current_location", "house_name", "current_local_id",
                          "sex_type", "birth_date", "sire", "dam")

    if (!all(required_columns %in% colnames(data))) {
      showNotification("Missing required columns in the studbook!", type = "error")
      return()
    }

    # Convert birth_date to numeric Birth_Year
    data <- data %>%
      mutate(birth_year = as.numeric(format(as.Date(birth_date, format = "%Y-%m-%d"), "%Y")))

    # Convert Sex_Type to numeric (1 = Male, 2 = Female)
    data <- data %>%
      mutate(
        sex = case_when(
          sex_type == "M" ~ 1,
          sex_type == "F" ~ 2,
          TRUE ~ NA_real_
        )
      )

    # Ensure sex is correctly assigned before creating the pedigree
    if (any(is.na(data$sex))) {
      stop("Error: Some individuals have missing sex values. Check the dataset.")
    }

    # Prepare pedigree data in the correct format for pedtools
    pedigree_data <- data %>%
      rename(id = studbook_id, father = sire, mother = dam) %>%
      select(id, father, mother, sex)

    # Ensure missing parents are properly represented
    pedigree_data <- pedigree_data %>%
      mutate(father = ifelse(father %in% id, father, NA),
             mother = ifelse(mother %in% id, mother, NA))

    # Create the pedigree object using pedtools
    pedigree_obj <- pedtools::ped(pedigree_data)

    # Compute kinship matrix using pedtools
    kin_matrix <- kinship(pedigree_obj)
    kinship_matrix(as.data.frame(as.matrix(kin_matrix)))

    # Store processed data
    studbook_data(data)

    # Update UI with individual selection
    updateSelectInput(session, "transfer_individual", choices = data$studbook_id)
    updateSelectInput(session, "select_individual", choices = data$studbook_id)
  })

  # Display processed studbook data as an interactive table
  output$studbook_preview <- renderDT({
    req(studbook_data())
    datatable(studbook_data(), options = list(pageLength = 10))
  })

  # Display kinship matrix
  output$kinship_matrix <- renderDT({
    req(kinship_matrix())
    datatable(kinship_matrix(), options = list(scrollX = TRUE))
  })

  # Allow download of kinship matrix
  output$download_kinship <- downloadHandler(
    filename = function() { "Kinship_Matrix.csv" },
    content = function(file) { write.csv(kinship_matrix(), file) }
  )

  # Display Interactive Pedigree Plot
  observeEvent(input$plot_pedigree, {
    req(studbook_data(), input$select_individual)
    data <- studbook_data()
    selected_id <- input$select_individual

    output$pedigree_plot <- renderPlot({
      plotPed(pedigree_obj, highlight = selected_id)
    })
  })

  # Store selected individuals for transfer
  transferred_individuals <- reactiveVal(data.frame(
    Studbook_ID = character(),
    Sex_Type = character(),
    Birth_Year = numeric(),
    stringsAsFactors = FALSE
  ))

  observeEvent(input$confirm_transfer, {
    req(studbook_data())
    selected_id <- input$transfer_individual
    individual_data <- studbook_data() %>% filter(studbook_id == selected_id)

    # Add selected individual to transfer list
    transferred_individuals(bind_rows(transferred_individuals(), individual_data))
    showNotification(paste("Individual", selected_id, "transferred!"), type = "message")
  })

  output$selected_individuals <- renderDT({
    datatable(transferred_individuals())
  })

  # Generate breeding recommendations
  observeEvent(input$generate_pairs, {
    req(studbook_data(), kinship_matrix())
    data <- studbook_data()
    kin_matrix <- kinship_matrix()

    # Pair individuals with lowest kinship
    males <- data %>% filter(sex_type == "M") %>% arrange(kin_matrix[id, id])
    females <- data %>% filter(sex_type == "F") %>% arrange(kin_matrix[id, id])

    num_pairs <- min(nrow(males), nrow(females))
    breeding_pairs <- data.frame(
      Male = males$id[1:num_pairs],
      Female = females$id[1:num_pairs],
      Kinship_Coefficient = kin_matrix[males$id[1:num_pairs], females$id[1:num_pairs]]
    )

    output$breeding_pairs <- renderDT({
      datatable(breeding_pairs, options = list(pageLength = 10))
    })
  })

  # Allow download of breeding pairs
  output$download_pairs <- downloadHandler(
    filename = function() { "Breeding_Pairs.xlsx" },
    content = function(file) { write_xlsx(breeding_pairs(), file) }
  )
}