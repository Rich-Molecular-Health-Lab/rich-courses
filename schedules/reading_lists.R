
topics2 <- list(
  Foundations =
    list(
      Intro = list(
        Topic   = "Intro to the Course",
          id    = "1c",
        Bibtex  = "None"
        ),
      Oversight = list(
        Topic   = "Institutions and Oversight",
          id    = c("2a", "2c"),
        Bibtex  = paste0(course$readings, "Oversight.bib"),
      )
    ),
  Conservation =
    list(
      RescueRehab = list(
        Topic   = "Headstarting, Rescue, and Rehabilitation",
          id    = "3a",
        Bibtex  = paste0(course$readings, "RescueRehab.bib"),
      ),
      AssurancePops = list(
        Topic   = "Assurance Populations",
          id    = c("3c", "4a"),
        Bibtex  = paste0(course$readings, "AssurancePops.bib"),
      )
    ),
  Health =
    list(
         DemographyGenetics = list(
           Topic   =  "Demographics and Genetics",
           Bibtex  = paste0(course$readings, "DemographyGenetics.bib"),
         ),
         Repro = list(
           Topic   = "Reproduction",
           Bibtex  = paste0(course$readings, "Repro.bib"),
         ),
         Medicine = list(
           Topic   = "Medicine",
           Bibtex  = paste0(course$readings, "Medicine.bib"),
         ),
         Nutrition = list(
           Topic   = "Nutrition",
           Bibtex  = paste0(course$readings, "Nutrition.bib"),
         )
    ),
  Behavior =
    list(
      BehaviorAssess = list(
        Topic   =  "Monitoring and Assessment",
        Bibtex  = paste0(course$readings, "BehaviorAssess.bib"),
      ),
      Training= list(
        Topic   = "Training and Management",
        Bibtex  = paste0(course$readings, "Training.bib"),
      ),
      Enrichment= list(
        Topic   = "Environmental Enrichment",
        Bibtex  = paste0(course$readings, "Enrichment.bib")
      )
    ),
  Society =
    list(
      Education= list(
        Topic   =  "Community Engagement and Education",
        Bibtex  = paste0(course$readings, "Education.bib")
      ),
      Accessibility= list(
        Topic   = "Accessibility and Inclusion",
        Bibtex  = paste0(course$readings, "Accessibility.bib")
      ),
      Advocacy= list(
        Topic   = "Public Policy and Advocacy",
        Bibtex  = paste0(course$readings, "Advocacy.bib")
      )
    )
)

