#import "common/template.typ": project
#import "common/glossary.typ": section_glossary
#import "common/global_glossary.typ": global_glossary_data

#show: project.with(
  title: "Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML",
  author: "Author Name",
  supervisor: "Prof. Dr. [Supervisor Name]",
  date: "February 2026",
  acknowledgments: [
    First and foremost, I would like to express my deepest gratitude to my supervisor, [Supervisor's Name], for their invaluable guidance, patience, and constant encouragement throughout the development of this research. Their expertise in embedded systems and artificial intelligence, along with their insightful critiques, were instrumental in shaping the trajectory of this thesis.

    I am also indebted to the technical staff at the Faculty of Engineering for providing the necessary laboratory resources and hardware support required for the experimental phase of this project. Special thanks are due to my peers and colleagues for the stimulating discussions and for providing a supportive environment that fostered critical thinking and technical rigor.

    Furthermore, I wish to thank my family and friends for their unwavering support and belief in my abilities. Their encouragement was a source of strength during the most challenging phases of this academic journey.

    Finally, I would like to acknowledge the developers and contributors of the open-source tools and platforms—specifically Arduino and Edge Impulse—whose technologies formed the foundation of the autonomous sensing node developed in this work.

    #v(1fr)
    #align(center)[
      #box(width: 40%)[
        #line(length: 100%, stroke: 0.5pt)
        #v(-0.5em)
        #align(center)[
          Author Name \
          February 2026
        ]
      ]
    ]
    #v(5em)
  ],
  abstract: [
    Traditional fire detection systems often struggle with false alarms triggered by non-combustion events such as cooking steam or aerosols. This thesis presents the development of an intelligent, autonomous multi-sensor fire detection node that leverages sensor fusion and TinyML to distinguish between genuine fires, ambient conditions, and common false alarm triggers. The system is built on the Arduino UNO R4 WiFi platform, utilizing its asymmetric multi-processing capabilities to decouple high-frequency sensor acquisition and local machine learning inference from low-priority telemetry tasks. A heterogeneous sensor suite—integrating smoke, volatile organic compounds (VOC), carbon monoxide (CO), infrared flame detection, and environmental temperature and humidity—provides a multi-modal "physical fingerprint" of the environment. A three-class classification model was developed and optimized using the Edge Impulse platform, employing an 8-bit quantized neural network for efficient edge deployment. Experimental results demonstrate that the system achieves 100% classification accuracy on a comprehensive validation dataset, with an on-device inference latency of less than 100 ms. A key finding of this research is the critical role of CO as a "truth sensor," providing a reliable differentiator that remains stable during false alarm scenarios. The proposed architecture offers a robust, low-power, and high-fidelity solution for next-generation autonomous fire safety systems in smart building environments.
  ],
  abbreviations: (
    ("AMP", "Asymmetric Multi-Processing"),
    ("CO", "Carbon Monoxide"),
    ("DSP", "Digital Signal Processing"),
    ("INT8", "8-bit Integer"),
    ("IR", "Infrared"),
    ("MEMS", "Micro-Electro-Mechanical Systems"),
    ("MQTT", "Message Queuing Telemetry Transport"),
    ("RAM", "Random Access Memory"),
    ("TinyML", "Tiny Machine Learning"),
    ("VOC", "Volatile Organic Compounds"),
  ),
  glossary: global_glossary_data,
)

// Chapters
#include "chapters/01_introduction/chapter.typ"
#include "chapters/02_literature_review/chapter.typ"
#include "chapters/03_theoretical_background/chapter.typ"
#include "chapters/04_sensor_selection_characterization/chapter.typ"
#include "chapters/05_hardware_platform_system_integration/chapter.typ"
#include "chapters/06_data_collection_methodology/chapter.typ"
#include "chapters/07_implementation/chapter.typ"
#include "chapters/08_experimental_results_evaluation/chapter.typ"
#include "chapters/09_discussion/chapter.typ"
#include "chapters/10_conclusion_future_work/chapter.typ"

// Bibliography
#bibliography("bibliography.bib", style: "apa")
