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
    "5" = list(
      "5a" = list(
        checastaldo2021 = "Expected demographic and genetic declines not found in most zoo and aquarium populations"),
      "5c" = list(
        speak2024 = "Genomics‐informed captive breeding can reduce inbreeding depression and the genetic load in zoo populations")
    ),
    "6" = list(
      "6a" = list(
        herrick2019      = "Assisted reproductive technologies for endangered species conservation: developing sophisticated protocols with limited access to animals with unique reproductive mechanisms"
        ),
      "6c" = list(
        agnew2021 = "DESLORELIN (SUPRELORIN®) USE IN NORTH AMERICAN AND EUROPEAN ZOOS AND AQUARIUMS: TAXONOMIC SCOPE, DOSING, AND EFFICACY"
        )
    ),
  "7" = list(
    "7a" = list(
      whilde2017 = "Precision wildlife medicine: applications of the human-centred precision medicine revolution to species conservation"
    ),
    "7c" = list(
      murphy2018 = "The Great Ape Heart Project"
      )
  ),
  "8" = list(
    "8a" = list(
      beheerder2017 = "Visual body condition scoring in zoo animals – composite, algorithm and overview approaches"
    ),
    "8c" = list(
      ramont2024 = "The Provision of Browse and Its Impacts on the Health and Welfare of Animals at the Zoo: A Review"
    )
  ),
  "11" = list(
    "11a" = list(
      veasey2021 = "Differing animal welfare conceptions and what they mean for the future of zoos and aquariums, insights from an animal welfare audit"
    ),
    "11c" = list(
      obrien2023 = "Doing better for understudied species: Evaluation and improvement of a species-general animal welfare assessment tool for zoos"
    )
  ),
  "12" = list(
    "12a" = list(
      ramirez2020 = "Choosing the Right Method: Reinforcement vs Punishment"
    ),
    "12c" = list(
      martin2020 = "The Art of ‘Active’ Training"
    )
  ),
  "13" = list(
    "13a" = list(
      brereton2023 = "An evaluation of the role of ‘biological evidence’ in zoo and aquarium enrichment practices"
    ),
    "13c" = list(
      podturkin2021 = "In search of the optimal enrichment program for zoo‐housed animals"
    )
    ),
  "14" = list(
    "14a" = list(
      howell2019 = "When zoo visitors “connect” with a zoo animal, what does that mean?"
    ),
    "14c" = list(
      moss2015 = "Evaluating the contribution of zoos and aquariums to Aichi Biodiversity Target 1"
    )
  ),
  "15" = list(
    "15a" = list(
      lukins2024 = "Access and Inclusion Go to the Zoo"
    ),
    "15c" = list(
      kong2017 = "A community-Based sensory Training Program leads to improved  experience at a local Zoo for children with sensory challenges"
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
    "4"  = list(
      "4a"  = list("215:239" = "Extinction: Global Patterns of Endangerment, Local Changes in Biodiversity"),
      "4b"  = list("240:248" = "Extinction: Controls of Extinction Risk")
    ),
    "6"  = list(
      "6a"  = list("249:276" = "Habitat Loss and Fragmentation"),
      "6b"  = list("277:284" = "Habitat Degradation")
    ),
    "7"  = list(
      "7a"  = list("285:292" = "Metapopulations and Landscape Mosaics"),
      "7b"  = list("293:321" = "Overexploitation")
    ),
    "8"  = list(
      "8a"  = list("322:328" = "Overexploitation"),
      "8b"  = list("329:368" = "Invasive Alien Species")
    ),
    "10"  = list(
      "10a"  = list("369:373" = "Climate Change"),
      "10b"  = list("374:402" = "Climate Change")
    ),
    "12"  = list(
      "12a"  = list("405:414" = "Species-Level Conservation: Goals and Challenges"),
      "12b"  = list("415:444" = "Species-Level Conservation: Statistics and Probability")
    ),
    "13"  = list(
      "13a"  = list("445:476" = "Community and Ecosystem Conservation"),
      "13b"  = list("477:505" = "Landscape-Scale Conservation: PA Networks")
    ),
    "14"  = list(
      "14a"  = list("506:520" = "Landscape-Scale Conservation: Monitoring and Modeling"),
      "14b"  = list("521:537" = "Ex Situ Conservation: Facilities")
    ),
    "15"  = list(
      "15a"  = list("538:554" = "Ex Situ Conservation: In Situ Contributions"),
      "15b"  = list("573:582" = "Sustainable Development: Case Studies")
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
          "Assurance Populations"
        ),
      Health =
        list(
          "Demographics and Genetics",
          "Reproduction",
          "Medicine",
          "Nutrition"
        ),
      Other =
        list(
          "No Class",
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
      ymd("2025-1-21")
    ),
    exams = list(
      "4c"  = "Exam 1",
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
     "4"  = list("4a"  = "Assurance Populations",
                 "4b"  = "Assurance Populations"),
     "5"  = list("5a"  = "Demographics and Genetics",
                 "5b"  = "Demographics and Genetics",
                 "5c"  = "Demographics and Genetics"),
     "6"  = list("6a"  = "Reproduction",
                 "6b"  = "Reproduction",
                 "6c"  = "Reproduction"),
     "7"  = list("7a"  = "Medicine",
                 "7b"  = "Medicine",
                 "7c"  = "Medicine"),
     "8"  = list("8a"  = "Nutrition",
                 "8b"  = "Nutrition",
                 "8c"  = "Nutrition"),
     "10"  = list("10a" = "Schedule Buffer",
                  "10b" = "Schedule Buffer",
                  "10c" = "Schedule Buffer"),
     "11" = list("11a" = "Schedule Buffer",
                 "11b" = "Schedule Buffer"),
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
      "5a"  = "Exam 1",
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
        "Extinction: Global Patterns of Endangerment, Local Changes in Biodiversity",
        "Extinction: Controls of Extinction Risk",
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
        "4a" = "Extinction: Global Patterns of Endangerment, Local Changes in Biodiversity",
        "4b" = "Extinction: Controls of Extinction Risk"),
      "5"  = list(
        "5b" = "Film Day"),
      "6"  = list(
        "6a" = "Habitat Loss and Fragmentation",
        "6b" = "Habitat Degradation"),
      "7"  = list(
        "7a" = "Metapopulations and Landscape Mosaics",
        "7b" = "Overexploitation"),
      "8"  = list(
        "8a" = "Overexploitation",
        "8b" = "Invasive Alien Species"),
      "10" = list(
        "10a" = "Climate Change",
        "10b" = "Climate Change"),
      "11" = list(
        "11b" = "Film Day"),
      "12" = list(
        "12a" = "Species-Level Conservation: Goals and Challenges",
        "12b" = "Species-Level Conservation: Statistics and Probability"),
      "13" = list(
        "13a" = "Community and Ecosystem Conservation",
        "13b" = "Landscape-Scale Conservation: PA Networks"),
      "14" = list(
        "14a" = "Landscape-Scale Conservation: Monitoring and Modeling",
        "14b" = "Ex Situ Conservation: Facilities"),
      "15" = list(
        "15a" = "Ex Situ Conservation: In Situ Contributions",
        "15b" = "Sustainable Development: Case Studies"),
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
    )
  )
)


labs <- list(
  zoobio = list(
  "2"  = list("Institutional Colection Plans" = paste0(course$lab_links, "LabW2_ICPs.html")),
  "3"  = list("SAFE Proposals"                = paste0(course$lab_links, "LabW3_SAFE.html")),
  "4"  = list("Breeding and Transfer Plans"   = NULL),
  "5"  = list("Population Viability Analysis" = NULL),
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

