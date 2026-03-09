#let project(
  title: "",
  subtitle: "",
  author: "",
  supervisor: "",
  date: "",
  university: "European University Cyprus",
  department: "School of Sciences | Department of Computer Science and Engineering",
  degree: "Master of Science",
  discipline: "Computer Science and Engineering",
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
    numbering: "1",
    number-align: center,
    footer: context {
      let page_num = counter(page).at(here()).first()
      if page_num > 2 {
        set text(8pt, style: "italic")
        stack(
          line(length: 100%, stroke: 0.5pt),
          v(0.2em),
          grid(
            columns: (1fr, 1fr),
            align(left, title),
            align(right, author)
          ),
          v(0.5em),
          align(center, counter(page).display(page.numbering))
        )
      }
    }
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

  // Title Page (EUC Template Style)
  align(center)[
    // Row #1: Long EUC Logo + Department
    #image("../assets/euc-logo-long.png", width: 100%)
    #v(0.5em)
    #text(1.1em, weight: 500, department)
    
    #v(4fr)

    // Row #2: Thesis Title
    #block(text(weight: 700, 2.2em, title))
    
    #v(1fr)

    // Row #3: SubTitle (only if applicable)
    #if subtitle != "" {
      text(1.5em, italic(subtitle))
    }
    
    #v(4fr)

    // Row #4: Master of Science in <discipline>
    #text(1.4em, weight: 500, [Master of Science]) \
    #v(0.5em)
    #text(1.3em, [In #discipline])
    
    #v(4fr)
    
    // Row #5: Author's Name
    #text(1.6em, weight: 700, author)
    
    #v(4fr)
    
    // Row #6: © Enter the month and year
    #text(1.2em, [© #date])
  ]

  pagebreak()

  // 1 Acknowledgments
  if acknowledgments != [] {
    heading(level: 1, outlined: true)[Acknowledgements]
    acknowledgments
    pagebreak()
  }

  // 2 Abstract
  heading(level: 1, outlined: true)[Abstract]
  abstract
  pagebreak()

  // 3 Table of Contents
  heading(level: 1, outlined: true)[Table of Contents]
  outline(title: none, depth: 3, indent: auto)
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
  set heading(numbering: "1.1")

  // Figure styling: Bold "Figure X" or "Table X"
  show figure.caption: it => [
    *#it.supplement #context it.counter.display()*: #it.body
  ]

  // Math equation styling: Centered and numbered
  set math.equation(numbering: "(1)")
  show math.equation.where(block: true): it => align(center, it)
  
  body
}
