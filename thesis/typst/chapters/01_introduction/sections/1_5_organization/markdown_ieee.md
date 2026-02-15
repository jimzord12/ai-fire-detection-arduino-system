# 1.5 Thesis Organization

The structure of this thesis is designed to provide a systematic progression from theoretical foundations to the empirical validation of an autonomous multi-sensor fire detection node. This logical flow is essential for addressing the complex interdependencies between hardware constraints, sensor modalities, and machine learning performance in safety-critical edge environments [1].

The document is organized into ten chapters. Following this introductory chapter, **Chapter 2** presents a systematic literature review conducted using a PRISMA-inspired protocol to identify research gaps in false alarm reduction and TinyML deployment [2]. **Chapter 3** establishes the theoretical background, covering the physics of combustion, sensor fusion principles, and neural network optimization for microcontrollers. **Chapter 4** details the selection and characterization of the MEMS sensors used in the prototype. **Chapter 5** describes the hardware integration, specifically focusing on the asymmetric multi-processing architecture of the Arduino UNO R4 WiFi.

The experimental methodology is detailed in **Chapter 6**, outlining safety protocols and the rationale for the three-class classification strategy. **Chapter 7** describes the technical implementation within the Edge Impulse platform and the development of the real-time inference firmware. **Chapter 8** evaluates the system through extensive experimental results, including an ablation study and on-device performance metrics. **Chapter 9** discusses the implications of class separability and the ethical considerations of AI in life-safety systems. Finally, **Chapter 10** summarizes the key findings, acknowledges limitations, and proposes avenues for future development, such as mesh network scalability.

### References

- [1] Park, J., Kim, K., & Choi, S. (2020). Early fire detection system based on multi-sensor fusion and deep learning. *Sensors*, *20*(22), 6542. https://doi.org/10.3390/s20226542
- [2] Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., Shamseer, L., Tetzlaff, J. M., Akl, E. A., Brennan, S. E., Chou, R., Glanville, J., Grimshaw, J. M., Hróbjartsson, A., Lalu, M. M., Li, T., Loder, E. W., Mayo-Wilson, E., McDonald, S., ... Moher, D. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. *BMJ*, *372*(n71). https://doi.org/10.1136/bmj.n71

### Glossary (optional)

- **PRISMA**: Preferred Reporting Items for Systematic Reviews and Meta-Analyses; a standardized evidence-based minimum set of items for reporting in reviews.
- **Asymmetric Multi-Processing (AMP)**: A system architecture where multiple processors or cores operate independently, often with different roles or architectures.
