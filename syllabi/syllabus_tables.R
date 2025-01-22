slos <- list(
  zoobio = tribble(
    ~Level            ,      ~Outcome           ,
    "Remember" ,    "Identify and recall key concepts and terminology related to zoo biology, such as taxonomic classifications, animal behavior terms, and basic biological principles." ,
    "Understand"   ,    "Explain the fundamental theories and principles of zoo biology, including the importance of biodiversity conservation and the role of zoos in wildlife conservation efforts." ,
    "Apply" , "Apply their knowledge of zoo biology to analyze and solve real-world problems related to animal care, exhibit design, and wildlife conservation strategies within a controlled zoo environment.",
    "Analyze" , "Evaluate the ethical and practical considerations involved in managing zoo populations, critically assess the impact of human activities on animal habitats, and propose evidence-based solutions for enhancing animal welfare and conservation efforts."
  ),
  conbio = tribble(
    ~Level            ,      ~Outcome           ,
    "Remember" ,    "Identify and recall key concepts and terminology related to zoo biology, such as taxonomic classifications, animal behavior terms, and basic biological principles." ,
    "Understand"   ,    "Explain the fundamental theories and principles of zoo biology, including the importance of biodiversity conservation and the role of zoos in wildlife conservation efforts." ,
    "Apply" , "Apply their knowledge of zoo biology to analyze and solve real-world problems related to animal care, exhibit design, and wildlife conservation strategies within a controlled zoo environment.",
    "Analyze" , "Evaluate the ethical and practical considerations involved in managing zoo populations, critically assess the impact of human activities on animal habitats, and propose evidence-based solutions for enhancing animal welfare and conservation efforts."
  )
)

grade_breakdown <- list(
  zoobio = tribble(
    ~Format                   ,    ~Points_each     ,   ~Count  , ~N_dropped   ,
    "Quizzes"                 ,    3                ,   12      ,  2           ,
    "Exams"                   ,    50               ,   3       ,  0           ,
    "Interview Prep"          ,    5                ,   12      ,  1           ,
    "Interview Moderating"    ,    20               ,   1       ,  0           ,
    "Lab Assignments"         ,    15               ,   10      ,  1           ) %>%
    mutate(Points_total = (Count - N_dropped) * Points_each) %>%
    mutate(Percent_total = Points_total/sum(Points_total)) %>%
    arrange(Percent_total) %>%
    select(Format, Points_each, Count, N_dropped, Points_total, Percent_total)
)

quiz_table <- tribble(
  ~Score,   ~Standard,
  0     ,   "Nothing submitted." ,
  1     ,   "Response suggests the student is not familiar with any of the background content." ,
  2     ,   "Response suggests the student reviewed some of the material but did not fully comprehend or has not thought critically about it." ,
  3     ,   "Response suggests the student has reviewed the background material and came to class prepared to engage in a thoughtful discussion.")

culture_table <- tribble(
  ~Value           ,  ~Rule                                                                                          , ~Icon         ,
  "1. Authenticity"   , "Speak up if you are confused or struggling."                                                   , "circle-check",
  "1. Authenticity"   , "Attempt to manipulate or mislead your instructors or classmates."                              , "ban"         ,
  "1. Authenticity"   , "Be honest with yourself about your needs & capabilities."                                      , "circle-check",
  "1. Authenticity"   , "Hide or deny your biases or areas for growth."                                                 , "ban"         ,
  "1. Authenticity"   , "Use tools like AI and collaboration with integrity."                                           , "circle-check",
  "1. Authenticity"   , "Present direct results from AI tools like ChatGPT as your own work."                           , "ban"         ,
  "1. Authenticity"   , "Take full personal responsibility for mistakes or missed opportunities."                       , "circle-check",
  "1. Authenticity"   , "Deflect blame or redirect responsibilities on your instructor or your classmates."             , "ban"         ,
  "2. Curiosity"      , "Use the readings and assignments as a guide."                                                  , "circle-check",
  "2. Curiosity"      , "Let the syllabus limit your investigation."                                                    , "ban"         ,
  "2. Curiosity"      , "Ask thoughtful questions of yourself, your instructor, and your colleagues."                   , "circle-check",
  "2. Curiosity"      , "Expect me to fill your brain with facts for you to recall."                                    , "ban"         ,
  "2. Curiosity"      , "Bring your ideas to my attention."                                                             , "circle-check",
  "2. Curiosity"      ,  "Assume I will not be open to changing or expanding your options."                             , "ban"         ,
  "3. Inclusion"      , "Make space for your colleagues to gain just as much as you."                                   , "circle-check",
  "3. Inclusion"      , "Dominate discussions."                                                                         , "ban"         ,
  "3. Inclusion"      , "Maintain awareness and openness to seeing your bias and privilege."                            , "circle-check",
  "3. Inclusion"      , "Assume everyone will share your perspectives or background."                                   , "ban"         ,
  "3. Inclusion"      , "Bring your barriers to my attention so I can help you navigate them."                          , "circle-check",
  "3. Inclusion"      , "Assume only you are navigating barriers or that barriers are insurmountable with cooperation." , "ban"         ) %>%
  arrange(Value, desc(Icon))

resources <- list(
  zoobio = tribble(
    ~Name    ,   ~Link      ,                                                                        ~Comment  ,
    "Journals", github$readings,  "I will post pdf files to this link and canvas.",
    "Canvas" , "https://unomaha.instructure.com/courses/81170"                               ,  "You must review Canvas regularly. For technical support, please use Canvas Student Support.",
    "Course Website", github$main, "I maintain a dynamic schedule and other materials through my lab's github site. These materials update automatically to their linked page on canvas."
  ) %>%
    mutate(Resource = str_glue(fixed("["), "{Name}", fixed("]("), "{Link}", fixed(")"))) %>%
    mutate(image = case_when(Name == "Journals"       ~ paste0(global$graphics, "journals.jpg"),
                             Name == "Canvas"         ~ paste0(global$graphics, "logo_canvas.png"),
                             Name == "Course Website" ~ paste0(global$graphics, "logo_git.png"))) %>%
    select(image, Resource, Comment, Name)
)
