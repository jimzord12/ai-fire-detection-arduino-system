## Core Philosophy for Configuration

- **Separation of concerns**: Keep all global styling, metadata, and layout logic in a dedicated `config.typ` (or `template.typ`) file.
- **Modularity**: Use functions (`#let`) to create reusable configurations that can be customized per project.
- **Metadata centrality**: Set document metadata once at the top level for PDF properties, outlines, and front matter consistency.
- **Show/Set rules**: Apply global customizations centrally to ensure consistency (e.g., heading styles, paragraph spacing, figure placement).
- **Package integration**: Load packages early and configure them in config.

## Document Metadata in

Typst uses the `#set document()` rule to define PDF metadata. This affects:
- PDF properties (title, author, subject, keywords, creator)
- Default values for front matter
- Automatic date handling

Best practice: Combine with a custom function for thesis-specific metadata.

### Basic Metadata Example (in main.typ or config.typ)

```typst
#set document(
  title: "Sensor Fusion and TinyML for Real-Time Fire Detection on Arduino-Based Edge Devices",
  author: "Your Full Name",
  date: none,  // Use datetime.today() later for dynamic date
  keywords: ("TinyML", "Edge Impulse", "Sensor Fusion", "Fire Detection", "Arduino", "Embedded AI"),
)
```

#### Advanced: Include subject and custom creator

```typst
#set document(
  title: title,
  author: author,
  date: submission-date,
  keywords: keywords,
  subject: "Master's Thesis in Electrical and Computer Engineering",
  creator: "Compiled with Typst " + metadata.version,
)
```

## Comprehensive config.typ Example

This is a robust, production-ready configuration for a thesis. It handles front matter, Roman/Arabic paging, custom supplements, and accessibility.

Save as `config.typ`:

```typst
// config.typ – Central configuration for thesis

#import "@preview/cetz:0.2.2": *
#import "@preview/codly:0.3.0": *
#import "@preview/glossarium:0.3.0": make-glossary, print-glossary
#import "@preview/subpar:0.1.2": *
#import "@preview/quill:0.2.0": *

#let thesis-config(
  title: "Default Title",
  subtitle: none,
  author: "Anonymous",
  supervisor: none,
  second-supervisor: none,
  university: "Your University",
  faculty: "Faculty of Engineering",
  degree: "Master of Science",
  submission-date: datetime.today(),
  abstract: [],
  keywords: (),
  acknowledgements: none,
  dedication: none,
  bibliography-file: "references.yml",
  glossary: false,
  show-outline: true,
  show-lof: true,
  show-lot: true,
  body
) = {

  // Global document metadata
  set document(
    title: title,
    author: author,
    date: submission-date,
    keywords: keywords,
  )

  // Global page setup
  set page(
    paper: "a4",
    margin: (x: 2.5cm, y: 3cm),
    numbering: none,  // Will override per section
    header: none,
    footer: locate(loc => {
      if counter(page).at(loc).first() > 1 {
        align(center)[#counter(page).display("1")]
      }
    }),
  )

  // Global text and paragraph settings
  set text(
    font: ("Linux Libertine", "TeX Gyre Pagella"),
    size: 11pt,
    lang: "en",
    region: "GR",  // For Greek users – adjust hyphenation
  )
  set par(justify: true, leading: 0.65em)
  set heading(numbering: "1.1.")

  // Custom show rules
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    block(inset: (bottom: 1.5em))[
      #text(1.6em, weight: "bold", it)
    ]
  }

  show figure.where(kind: image): set figure(supplement: "Fig.")
  show figure.where(kind: table): set figure(supplement: "Table")
  show figure.where(kind: raw): set figure(supplement: "Listing")

  show link: underline
  show ref: it => {
    let el = it.element
    if el != none and el.func() == figure {
      link(el.location())[#el.supplement #counter(figure).at(el.location()).first()]
    } else {
      it
    }
  }

  // Front matter (Roman numbering)
  set page(numbering: "i")
  counter(page).update(1)

  // Title page
  align(center + horizon)[
    #v(5cm)
    #text(2em, weight: "bold", title)
    #if subtitle != none [#v(0.5em); text(1.4em, subtitle)]
    #v(3cm)
    #text(1.6em, degree)
    #v(2cm)
    #text(1.4em, author)
    #v(4cm)
    #text(1.2em, university)
    #linebreak()
    #text(1.2em, faculty)
    #v(1cm)
    #submission-date.display("[month repr:long] [year]")
  ]

  pagebreak()

  // Abstract
  if abstract != none {
    heading("Abstract", outlined: false)
    abstract
    pagebreak()
  }

  // Keywords
  if keywords.len() > 0 {
    strong[Keywords:] #keywords.join(", ")
    pagebreak()
  }

  // Acknowledgements/Dedication
  if dedication != none {
    v(10cm)
    align(center, italic(dedication))
    pagebreak()
  }
  if acknowledgements != none {
    heading("Acknowledgements", outlined: false)
    acknowledgements
    pagebreak()
  }

  // Table of Contents and Lists
  if show-outline {
    outline(title: "Table of Contents", indent: auto, depth: 3)
    pagebreak()
  }
  if show-lof {
    outline(title: "List of Figures", target: figure.where(kind: image))
    pagebreak()
  }
  if show-lot {
    outline(title: "List of Tables", target: figure.where(kind: table))
    pagebreak()
  }

  // Main matter (Arabic numbering)
  set page(numbering: "1")
  counter(page).update(1)

  // Insert body (imported chapters)
  body

  // Back matter
  pagebreak()
  if glossary {
    print-glossary()
    pagebreak()
  }

  bibliography(references.yml, style: "ieee", title: "References")
}
```

## Usage in main.typ

In your main document file (`main.typ`), import and apply the configuration:

```typst
#import "config.typ": thesis-config

#show: thesis-config.with(
  title: "Sensor Fusion and TinyML for Real-Time Fire Detection on Arduino-Based Edge Devices Using Edge Impulse",
  author: "Jim Zordas",  // Personalized for user
  degree: "Master of Science in Electrical Engineering",
  university: "National Technical University of Athens",
  submission-date: datetime(year: 2026, month: 1, day: 18),
  abstract: [
    This thesis presents a low-cost, real-time fire detection system using multi-sensor fusion and TinyML on Arduino platforms...
  ],
  keywords: ("fire detection", "sensor fusion", "TinyML", "Edge Impulse", "Arduino", "embedded machine learning"),
  bibliography-file: "references.yml",
  glossary: true,
)

#import "chapters/introduction.typ": *
#import "chapters/literature.typ": *
// ... other chapters

```

## Additional Best Practices

- **Dynamic dates**: Use `datetime.today()` for compilation date or fixed for submission.
- **Localization**: For Greek theses, add `lang: "el"` in sections needing Greek text.
- **PDF/A compliance**: Use packages like `@preview/pdf-a` if required by university.
- **Custom headers/footers**: Add university logo with `image("logo.png")` in header.
- **Version control**: Store config separately to reuse across projects.

This configuration is highly customizable and follows patterns from popular templates like `typst-thesis-template` and `ls1intum/thesis-template-typst`.