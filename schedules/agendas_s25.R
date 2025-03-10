holidays <- list(
  MLKDay = list(ymd("2025-1-20")),
  SpringBreak = as.list(seq.Date(from = ymd("2025-3-17"), by = "day", length.out = 5))
) %>%
  list_flatten(name_spec = "{outer}")

specials <- list(
  zoobio = list(
    "8" = list(
      "8a" = "Guest Expert: Dr. Cayla Iske"
    )
  )
)

readings <- list(
  zoobio = list(
    "2" = list(
      "2a" = list(
        hutchins2003 = "In Defense of Zoos and Aquariums: The Ethical Basis for Keeping Wild Animals in Captivity"),
      "2c" = list(
        winders2017 = "Can zoos offer more than entertainment?")
    ),
    "3" = list(
      "3a" = list(
        gilbert2017 = "The Role of Zoos and Aquariums in Reintroductions and Other Conservation Translocations"),
      "3c" = list(
        harding2016 = "Developments in amphibian captive breedingand reintroduction programs")
    ),
    "4" = list(
      "4a" = list(
        powell2019 = "Collection planning for the next 100 years: What will we commit to save in zoos and aquariums?")
    ),
    "6" = list(
      "6a" = list(
        checastaldo2021 = "Expected demographic and genetic declines not found in most zoo and aquarium populations"),
      "6c" = list(
        speak2024 = "Genomics‐informed captive breeding can reduce inbreeding depression and the genetic load in zoo populations")
    ),
    "8" = list(
      "8a" = list(
        beheerder2017 = "Visual body condition scoring in zoo animals – composite, algorithm and overview approaches"
      ),
      "8c" = list(
        ramont2024 = "The Provision of Browse and Its Impacts on the Health and Welfare of Animals at the Zoo: A Review"
      )
    ),
    "10" = list(
      "10a" = list(
        herrick2019 = "Assisted reproductive technologies for endangered species conservation: developing sophisticated protocols with limited access to animals with unique reproductive mechanisms"
      ),
      "10c" = list(
        asa2016 = "Weighing the Options for Limiting Surplus Animals"
      )
    ),
  "11" = list(
    "11a" = list(
      whilde2017 = "Precision wildlife medicine: applications of the human-centred precision medicine revolution to species conservation"
    )
  ),
  "12" = list(
    "12a" = list(
      veasey2021 = "Differing animal welfare conceptions and what they mean for the future of zoos and aquariums, insights from an animal welfare audit"
    ),
    "12c" = list(
      obrien2023 = "Doing better for understudied species: Evaluation and improvement of a species-general animal welfare assessment tool for zoos"
    )
  ),
  "13" = list(
    "13a" = list(
      ramirez2020 = "Choosing the Right Method: Reinforcement vs Punishment"
    ),
    "13c" = list(
      martin2020 = "The Art of ‘Active’ Training"
    )
  ),
  "14" = list(
    "14a" = list(
      brereton2023 = "An evaluation of the role of ‘biological evidence’ in zoo and aquarium enrichment practices"
    ),
    "14c" = list(
      podturkin2021 = "In search of the optimal enrichment program for zoo‐housed animals"
    )
    ),
  "15" = list(
    "15a" = list(
      howell2019 = "When zoo visitors “connect” with a zoo animal, what does that mean?"
    ),
    "15c" = list(
      lukins2024 = "Access and Inclusion Go to the Zoo"
    )
  ),
  "16" = list(
    "16a" = list(
      spooner2023 = "The value of zoos for species and society: The need for a new model."
        )
      )
  ),
  conbio = list(
    "2"  = list(
      "2a"  = list("53:57" = "Biodiversity Concepts and Measurement: Genetic Diversity"),
       "2b" = list("58:66" = "Biodiversity Concepts and Measurement: Species Diversity")
      ),
    "3"  = list(
      "3a"  = list("67:80" = "Biodiversity Concepts and Measurement: Community and Ecosystem Diversity"),
      "3b"  = list("141:180" = "Biodiversity and Ecosystem Services")
    ),
    "6" = list(
      "6b" = list("215:248" = "Extinction")
    ),
    "7"  = list(
      "7a"  = list("249:276" = "Habitat Loss and Fragmentation")
    ),
    "8"  = list(
      "8b"  = list("277:284" = "Habitat Degradation")
    ),
    "10"  = list(
      "10a"  = list("285:292" = "Metapopulations and Landscape Mosaics"),
      "10b"  = list("293:328" = "Overexploitation"                     )
    ),
    "12"  = list(
      "12a"  = list("329:368" = "Invasive Alien Species"),
      "12b"  = list("369:402" = "Climate Change"        )
    ),
    "13"  = list(
      "13a"  = list("405:414" = "Species-Level Conservation: Goals and Challenges"      ),
      "13b"  = list("415:444" = "Species-Level Conservation: Statistics and Probability")
    ),
    "14"  = list(
      "14a"  = list("445:476" = "Community and Ecosystem Conservation"     ),
      "14b"  = list("477:505" = "Landscape-Scale Conservation: PA Networks")
    ),
    "15"  = list(
      "15a"  = list("506:520" = "Landscape-Scale Conservation: Monitoring and Modeling"),
      "15b"  = list("521:554" = "Ex Situ Conservation")
    )
  )
)



agenda <- list(
  zoobio = list(
    themes = list(
      Foundations =
        list(
          "Intro to the Course",
          "Institutions and Oversight"
        ),
      Conservation =
        list(
          "Headstarting, Rescue, and Rehabilitation",
          "Assurance Populations",
          "Demography and Genetics"
        ),
      Health =
        list(
          "Reproduction",
          "Medicine",
          "Nutrition"
        ),
      Other =
        list(
          "No Class",
          "Film Day",
          "Schedule Buffer",
          "Exam"
        ),
      Behavior =
        list(
          "Monitoring and Assessment",
          "Training and Management",
          "Environmental Enrichment"
        ),
      Society =
        list(
          "Community Engagement and Education",
          "Accessibility and Inclusion",
          "Public Policy and Advocacy"
        )
    ),
    cancelled = list(
      ymd("2025-1-21"),
      ymd("2025-2-12"),
      ymd("2025-2-17")
    ),
    exams = list(
      "11c" = "Exam 2",
      "17c" = "Final Exam"
    ),
    topics = list(
      "1" = list(
     "1c"  = "Intro to the Course"
     ),
     "2"  = list(
       "2a"  = "Institutions and Oversight",
       "2b"  = "Institutions and Oversight",
       "2c"  = "Institutions and Oversight"
                  ),
     "3" = list(
       "3a"  = "Headstarting, Rescue, and Rehabilitation",
       "3b"  = "Headstarting, Rescue, and Rehabilitation",
       "3c"  = "Assurance Populations"
     ),
     "4"  = list("4a"  = "Assurance Populations"),
     "5"  = list("5c"  = "Film Day"),
     "6"  = list("6a"  = "Demography and Genetics",
                 "6b"  = "Demography and Genetics",
                 "6c"  = "Demography and Genetics"),
     "7"  = list("7a"  = "Demography and Genetics",
                 "7b"  = "Demography and Genetics",
                 "7c"  = "Nutrition"),
     "8"  = list("8a"  = "Nutrition",
                 "8b"  = "Demography and Genetics",
                 "8c"  = "Nutrition"),
     "10"  = list("10a" = "Reproduction",
                  "10b" = "Reproduction",
                  "10c" = "Reproduction"),
     "11" = list("11a" = "Medicine",
                 "11b" = "Medicine"),
     "12" = list("12a" = "Monitoring and Assessment",
                 "12b" = "Monitoring and Assessment",
                 "12c" = "Monitoring and Assessment"),
     "13" = list("13a" = "Training and Management",
                 "13b" = "Training and Management",
                 "13c" = "Training and Management"),
     "14" = list("14a" = "Environmental Enrichment",
                 "14b" = "Environmental Enrichment",
                 "14c" = "Environmental Enrichment"),
     "15" = list("15a" = "Community Engagement and Education",
                 "15b" = "Community Engagement and Education",
                 "15c" = "Accessibility and Inclusion"),
     "16" = list("16a" = "Public Policy and Advocacy",
                 "16b" = "Public Policy and Advocacy",
                 "16c" = "Public Policy and Advocacy")
      )
    ),
  conbio = list(
    exams = list(
      "5b"  = "Exam 1",
      "11a" = "Exam 2",
      "17a" = "Final Exam"
    ),
    themes = list(
      "Foundations of Conservation Biology" = list(
        "Biodiversity Concepts and Measurement: Genetic Diversity",
        "Biodiversity Concepts and Measurement: Species Diversity",
        "Biodiversity Concepts and Measurement: Community and Ecosystem Diversity"
      ),
      "Importance of Biodiversity" = list(
        "Biodiversity and Ecosystem Services"
      ),
      "Threats to Biodiversity" = list(
        "Extinction",
        "Habitat Loss and Fragmentation",
        "Habitat Degradation",
        "Metapopulations and Landscape Mosaics",
        "Overexploitation",
        "Invasive Alien Species",
        "Climate Change"
      ),
      "Approaches to Conservation" = list(
        "Species-Level Conservation: Goals and Challenges",
        "Species-Level Conservation: Statistics and Probability",
        "Community and Ecosystem Conservation",
        "Landscape-Scale Conservation: PA Networks",
        "Landscape-Scale Conservation: Monitoring and Modeling",
        "Ex Situ Conservation: Facilities",
        "Ex Situ Conservation: In Situ Contributions",
        "Sustainable Development: Case Studies"

      ),
      "Other" =
        list(
          "No Class",
          "Film Day",
          "Schedule Buffer",
          "Exam"
        )
    ),
    topics = list(
      "1" = list(
        "1b" = "Intro to the Class"),
      "2"  = list(
        "2a" = "Biodiversity Concepts and Measurement: Genetic Diversity",
        "2b" = "Biodiversity Concepts and Measurement: Species Diversity"),
      "3"  = list(
        "3a" = "Biodiversity Concepts and Measurement: Community and Ecosystem Diversity",
        "3b" = "Biodiversity and Ecosystem Services"),
      "4"  = list(
        "4a" = "Biodiversity and Ecosystem Services",
        "4b" = "No Class"),
      "5"  = list(
        "5a" = "No Class"
        ),
      "6"  = list(
        "6a" = "Film Day",
        "6b" = "Extinction"
      ),
      "7"  = list(
        "7a" = "Habitat Loss and Fragmentation",
        "7b" = "No Class"),
      "8"  = list(
        "8a" = "Habitat Loss and Fragmentation",
        "8b" = "Habitat Degradation"),
      "10"  = list(
        "10a" = "Metapopulations and Landscape Mosaics",
        "10b" = "Overexploitation"                     ),
      "11" = list(
        "11b" = "Film Day"),
      "12" = list(
        "12a" = "Invasive Alien Species" ,
        "12b" = "Climate Change"        ),
      "13" = list(
        "13a" = "Species-Level Conservation: Goals and Challenges"      ,
        "13b" = "Species-Level Conservation: Statistics and Probability"),
      "14" = list(
        "14a" = "Community and Ecosystem Conservation",
        "14b" = "Landscape-Scale Conservation: PA Networks"),
      "15" = list(
        "15a" = "Landscape-Scale Conservation: Monitoring and Modeling",
        "15b" = "Ex Situ Conservation"),
      "16" = list(
        "16a" = "Film Day",
        "16b" = "Film Day")

    )
  )
  )

slides <- list(
  zoobio = list(
    "1" = list(
      "1c" = "https://www.canva.com/design/DAGc5pniAOc/3s5MrUXg4zIqHWXzg6AVsw/view?utm_content=DAGc5pniAOc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h453833c08f"
    ),
    "2" = list(
      "2a" = "https://www.canva.com/design/DAGdaLRumnY/RapvieDDSDFfNeSTj0aIZw/view?utm_content=DAGdaLRumnY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h31c6faffd2",
      "2c" = "https://www.canva.com/design/DAGdmPPRV18/gyat2tLVE1bICS3mZKZNpA/view?utm_content=DAGdmPPRV18&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha0c459a64d"
    ),
    "3" = list(
      "3a" = "https://www.canva.com/design/DAGeEG2-Ob0/rXRuDs5QKEEUxkLD5N40xQ/view?utm_content=DAGeEG2-Ob0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h205bd7b45a"
    ),
    "4" = list(
      "4a" = "https://www.canva.com/design/DAGeuZvv_fY/sg_kJ9SN6OuXdWiY0Gtezg/view?utm_content=DAGeuZvv_fY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha1ca60f363"
    ),
    "5" = list(
      "5c" = "https://www.pbs.org/wnet/nature/the-loneliest-animals-introduction/4898/"
    ),
    "6" = list(
      "6a" = "https://www.canva.com/design/DAGgCJiox1M/Z7_zU4n_OdQ1Bvvwegledw/view?utm_content=DAGgCJiox1M&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hcd1a0c76e4",
      "6c" = "https://www.canva.com/design/DAGgOeZ3JSI/wPpzQX4cNhECskSsjpdPqg/view?utm_content=DAGgOeZ3JSI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h154cce3cdf"
    ),
    "7" = list(
      "7a" = "https://www.canva.com/design/DAGgsez7wHg/rCdtUcra1w89VmWlBN_-GA/view?utm_content=DAGgsez7wHg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h87473817fa",
      "7c" = "https://www.canva.com/design/DAGg4juK6S0/Q_TrSRMY-gunpA2uKo77kQ/view?utm_content=DAGg4juK6S0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h9348825482"
    ),
    "8" = list(
      "8a" = "https://docs.google.com/document/d/151rEWzudAYADLTq8VCKzJ5miTW5ie-AM3ZCWkVt3WNY/edit?usp=sharing"
    )
  ),
  conbio = list(
    "1" = list(
      "1b" = "https://www.canva.com/design/DAGc5nEJ1zo/CabP4Rhu_vTF8YLd9eLRng/view?utm_content=DAGc5nEJ1zo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h791d6739f5"
    ),
    "2" = list(
      "2a" = "https://www.canva.com/design/DAGdbOMNMfk/JGhADvMqyRMh9XDAI3IwVg/view?utm_content=DAGdbOMNMfk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1a7e2f2a85",
      "2b" = "https://www.canva.com/design/DAGdhksrZMQ/zBHC6EoXETBavgjaqJh3sw/view?utm_content=DAGdhksrZMQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h7e50a2c3c8"
    ),
    "3" = list(
      "3a" = "https://www.canva.com/design/DAGeFEwP32Q/reLA5LbMMlsm1lJWTKAB9A/view?utm_content=DAGeFEwP32Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h0efd2fa19e"
    ),
    "4" = list(
      "4a" = "https://www.canva.com/design/DAGeRJOojJ8/L7goJvCIf3O469iFVrhXmQ/view?utm_content=DAGeRJOojJ8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hdfc75537fc"
    ),
    "6" = list(
      "6a" = "https://www.pbs.org/video/top-predator-lv0cff",
      "6b" = "https://www.canva.com/design/DAGgDC21tSE/UfVsK1y_fXRk8qg-HAp9OQ/view?utm_content=DAGgDC21tSE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8cd8acc0d7"
    ),
    "7" = list(
      "7a" = "https://www.canva.com/design/DAGgtEbN5Ow/L0UTOTJk4FD3kjZZ9OMeXw/view?utm_content=DAGgtEbN5Ow&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he167018c43"
    ),
    "8" = list(
      "8a" = "https://www.canva.com/design/DAGhW2YMqkQ/VyHZKcZyZSZ4yskDACZnww/view?utm_content=DAGhW2YMqkQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hd9d543af38"
    )
  )
)


labs <- list(
  zoobio = list(
  "2"  = list("Institutional Colection Plans" = paste0(course$lab_links, "LabW2_ICPs.html")),
  "3"  = list("SAFE Proposals"                = paste0(course$lab_links, "LabW3_SAFE.html")),
  "4"  = list("Studbook Data Management"      = paste0(course$lab_links, "LabW4_Studbooks.html")),
  "5"  = list("Exam 1 (make-up due to snow day)"),
  "6"  = list("Genetic Data"                  = NULL),
  "7"  = list("Behavioral Data"               = NULL),
  "8"  = list("Diet Plans"                    = NULL),
  "10" = list("Enrichment Design"             = NULL),
  "11" = list("Enrichment Workshop"           = NULL),
  "12" = list("Welfare Assessment Plan"       = NULL),
  "13" = list("Training Workshop"             = NULL),
  "14" = list("Enrichment Workshop"           = NULL),
  "15" = list("Exhibit Signage and Programs"  = NULL),
  "16" = list("Enrichment Workshop"           = NULL)
  ),
  conbio = NULL
)

graded_work <- list(
  zoobio = list(
    "2a" = ""
  )
)


readings  <- readings[[paste0(params$course)]]
slides    <- slides[[paste0(params$course)]]
labs      <- labs[[paste0(params$course)]]
agenda    <- agenda[[paste0(params$course)]]
exams     <- agenda$exams
cancelled <- agenda$cancelled
topics    <- agenda$topics
themes    <- agenda$themes
specials  <- specials[[paste0(params$course)]]

