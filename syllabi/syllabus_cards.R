
logistics <- card(class = "bg-secondary",
       card_header("Course Logistics"),
       card_title(paste0("This course meets: ", course$when, " in ", course$where)),
       card_body(course$description),
       card_footer(paste0("Prerequisites: ", course$prereqs))

)

assignments <- list(
  zoobio =
    card(class = "bg-secondary",
         card_header("Interview Assignments"),
         card_title("Zoo Biology is an applied discipline that encompasses a much broader range of careers and expertise than most realize."),
         card_body(
           p("We will take a tour of some of these careers and interests by interviewing a series of experts from Henry Doorly Zoo and other institutions."),
           p("You will be the drivers of these sessions, which means I expect you to do your own critical thinking and preparation before our meeting with a given expert. Each of you will post a set of potential interview questions for each guest, which we will discuss as a class."),
           p("One small group of students will be in charge of compiling and revising the question list for every  guest and then moderating our class interview with them.")
         ),
         card_footer(em("Schedule of interviews TBD"))


  ),
  conbio =
    card(class = "bg-secondary",
         card_header("Assignments"),
         card_title("Conservation Biology is an applied discipline that encompasses a much broader range of careers and expertise than most realize."),
         card_body(
           p("We may work on applied skills through a few special assignments spread throughout the semester."),
         ),
         card_footer(em("These assignments may occur during class and without advanced notice, so you must be in attendance to earn credit."))

  )
)

text <- list(
  zoobio = card(class = "bg-secondary",
         card_header("Required Readings"),
         card_title("All assigned readings will come from journals and other online materials, and they are listed in the schedule."),
         card_body("We will use our class time to work together on some of the most important or challenging concepts, but this will not be a substitute for reading and studying the material on your own."),
         card_footer(strong("You should be prepared to answer quiz questions on anything from the assigned readings starting on the deadline listed in the schedule."))

  ),
  conbio =  card(class = "bg-secondary",
         card_header("Required Text"),
         layout_columns(
           col_widths = c(5, 7),
           card_image(file = paste0(global$graphics, course$text$image), width = "15%"),
           card_title(course$text$title)
         ),
         layout_columns(
           col_widths = c(-5, 7),
           card_body(
             p(paste0("Authors: ", course$text$authors)),
             p(paste0("Date: ", course$text$date, " (", course$text$edition, " edition)")),
             p(paste0("ISBN: ", course$text$ISBN)))
         ),
         card_footer("If you prefer a hardcopy version then you must opt out of automatic purchase of the eBook through Canvas by the end of Week 2.")
    )

)

cards_assignments <- assignments[[paste0(params$course)]]
cards_text <- text[[paste0(params$course)]]