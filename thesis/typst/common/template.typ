#let project(
  title: "",
  author: "",
  date: "",
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

  // Title Page
  align(center)[
    #v(5em)
    #block(text(weight: 700, 2em, title))
    #v(3em)
    #text(1.5em, author)
    #v(1em)
    #text(1.2em, [A Thesis Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Engineering])
    #v(10em)
    #date
  ]

  pagebreak()

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
