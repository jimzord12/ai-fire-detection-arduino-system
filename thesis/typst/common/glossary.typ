// Section-local glossary helper.
//
// Usage in any included chapter/section (available globally via thesis/typst/main.typ):
//   #section_glossary((
//     (term: "TinyML", def: "Machine learning models designed to run on microcontrollers under tight RAM/Flash and power constraints."),
//     (term: "Sensor fusion", def: "Combining multiple sensor modalities to improve discrimination of fire vs nuisance events."),
//   ))
//
// If the provided array is empty, nothing is rendered.

#let section_glossary(entries: ()) = {
  if entries.len() == 0 {
    none
  } else {
    heading(level: 3)[Glossary]
    list(..entries.map(e => [*#e.term*: #e.def]))
  }
}
