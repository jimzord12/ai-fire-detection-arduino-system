#import "common/template.typ": project

#show: project.with(
  title: "Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML",
  author: "Your Name",
  date: "February 2026",
  abstract: [
    This thesis presents the development of an intelligent edge-deployed fire detection system...
    // To be completed
  ],
)

// Chapters
#include "chapters/01_introduction/chapter.typ"
#include "chapters/02_literature_review/chapter.typ"
#include "chapters/03_theoretical_background/chapter.typ"
#include "chapters/04_sensor_characterization/chapter.typ"
#include "chapters/05_hardware_integration/chapter.typ"
#include "chapters/06_data_collection/chapter.typ"
#include "chapters/07_implementation/chapter.typ"
#include "chapters/08_results_evaluation/chapter.typ"
#include "chapters/09_discussion/chapter.typ"
#include "chapters/10_conclusion/chapter.typ"

// Bibliography
#bibliography("bibliography.bib", style: "apa")
