#let project(
  title: "",
  author: "",
  date: "",
  abstract: [],
  body,
) = {
  // Set document metadata
  set document(title: title, author: author)

  // Set page properties
  set page(
    paper: "a4",
    margin: (x: 2.5cm, y: 2.5cm),
    numbering: "1",
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
    #block(text(weight: 700, 1.75em, title))
    #v(2em)
    #text(1.2em, author)
    #v(1em)
    #date
  ]

  pagebreak()

  // Abstract
  heading(level: 1, outlined: false)[Abstract]
  abstract

  pagebreak()

  // Table of Contents
  outline(depth: 3, indent: auto)

  pagebreak()

  // Main Body
  set heading(numbering: "1.1")
  body
}
