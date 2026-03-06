#let project(
  title: "",
  author: "",
  supervisor: "",
  date: "",
  university: "[University Name]",
  department: "[Department Name]",
  degree: "Bachelor of Engineering",
  abstract: [],
  acknowledgments: [],
  abbreviations: (),
  glossary: (),
  body,
) = {
  // Set document metadata
  set document(title: title, author: author)

  // Set page properties
  set page(
    paper: "a4",
    margin: (x: 2.5cm, y: 2.5cm),
    numbering: "i",
    number-align: center,
  )

  // Set text properties
  set text(
    font: "New Computer Modern",
    size: 11pt,
    lang: "en",
  )

  // Global styling rules
  show heading: set block(below: 1.5em)
  show outline: set block(below: 1.5em)

  // Title Page
  align(center)[
    #text(1.5em, weight: 700, university) \
    #text(1.2em, department)
    
    #v(1fr)

    // University Logo
    #image("../assets/euc-logo.png", height: 4cm)
    
    #v(1fr)
    
    #block(text(weight: 700, 2.5em, title))
    
    #v(1fr)
    
    #text(1.5em, author) \
    #v(0.5em)
    #text(1.1em, [Supervisor: #supervisor]) \
    #v(1em)
    #text(1.2em, [A Thesis Submitted in Partial Fulfillment of the Requirements for the Degree of]) \
    #text(1.2em, weight: 700, degree)
    
    #v(2fr)
    
    #date
  ]

  pagebreak()

  // Footer setup (starting after title page)
  set page(
    footer: context [
      #set text(8pt, style: "italic")
      #line(length: 100%, stroke: 0.5pt)
      #grid(
        columns: (1fr, 1fr),
        align(left, title),
        align(right, author)
      )
      #v(-0.5em)
      #align(center, counter(page).display(page.numbering))
    ]
  )

  // Acknowledgments
  if acknowledgments != [] {
    heading(level: 1, outlined: false)[Acknowledgments]
    acknowledgments
    pagebreak()
  }

  // Abstract
  heading(level: 1, outlined: false)[Abstract]
  abstract

  pagebreak()

  // Table of Contents
  outline(title: [Table of Contents], depth: 3, indent: auto)

  pagebreak()

  // List of Figures
  outline(
    title: [List of Figures],
    target: figure.where(kind: image),
  )

  pagebreak()

  // List of Tables
  outline(
    title: [List of Tables],
    target: figure.where(kind: table),
  )

  pagebreak()

  // Abbreviations
  if abbreviations.len() > 0 {
    heading(level: 1, outlined: false)[List of Abbreviations]
    let sorted_abbreviations = abbreviations.sorted(key: (it) => it.at(0))
    grid(
      columns: (1fr, 3fr),
      gutter: 1em,
      ..sorted_abbreviations.map(it => ([*#it.at(0)*], it.at(1))).flatten()
    )
    pagebreak()
  }

  // Glossary
  if glossary.len() > 0 {
    heading(level: 1, outlined: false)[Glossary]
    let sorted_glossary = glossary.sorted(key: (it) => it.at(0))
    grid(
      columns: (1fr, 3fr),
      gutter: 1.5em,
      ..sorted_glossary.map(it => ([*#it.at(0)*], it.at(1))).flatten()
    )
    pagebreak()
  }

  // Main Body
  set page(numbering: "1")
  counter(page).update(1)
  set heading(numbering: "1.1")
  body
}
