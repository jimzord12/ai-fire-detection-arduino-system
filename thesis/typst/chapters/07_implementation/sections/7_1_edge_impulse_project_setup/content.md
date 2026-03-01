# 7.1 Edge Impulse Project Setup

The implementation of a TinyML-based multi-sensor fire detection system requires a structured development environment capable of managing the full machine learning lifecycle — from raw sensor data ingestion to on-device inference deployment. This section describes the configuration of the Edge Impulse project environment as the foundational step in the implementation pipeline, covering platform rationale, project initialization, data ingestion strategy, and target hardware configuration.

## 7.1.1 Platform Rationale and Project Initialization

Embedded machine learning development presents a distinctive set of challenges that distinguish it from conventional cloud-based workflows. Hymel et al. (2023) identify five systemic obstacles in the TinyML development cycle: data collection scarcity, the absence of automated digital signal processing (DSP) tooling, dependency management complexity, hardware heterogeneity across embedded architectures, and the lack of a unified MLOps monitoring framework. These challenges are particularly acute in multi-sensor IoT applications, where raw data originates from heterogeneous physical sources and must be preprocessed consistently across both the training and inference stages.

Edge Impulse was selected as the primary development platform for this project due to its end-to-end MLOps architecture, which integrates data collection, DSP block configuration, neural network training, and C/C++ library deployment into a single coherent pipeline (Hymel et al., 2023). The platform is specifically engineered for resource-constrained embedded targets — including ARM Cortex-M4 microcontrollers — and provides hardware-aware optimization through its EON Compiler, which eliminates the TFLM interpreter overhead and directly generates optimized C++ kernel calls, reducing both RAM and Flash usage compared to standard TFLM deployment (Hymel et al., 2023). For the Arduino UNO R4 WiFi, which houses a Renesas RA4M1 (ARM Cortex-M4, 48 MHz) with 256 KB SRAM and 1 MB Flash, these constraints demand that preprocessing and inference operations be co-optimized from the outset rather than treated as independent design concerns.

## 7.1.2 Data Ingestion and Labeling Configuration

A new Edge Impulse project was initialized and configured to accept multi-channel time-series data from the five onboard sensors: MEMS smoke, MEMS VOC, MEMS CO, IR flame, and AHT20 temperature/humidity. Data was ingested using the Edge Impulse CLI Data Forwarder, which streams live sensor readings from the target device via a serial USB connection at a sampling frequency of 10 Hz. This approach aligns with the platform's explicitly data-centric design philosophy, which prioritizes real-world, on-device data collection over reliance on synthetic or third-party datasets as a means of improving generalization (Hymel et al., 2023).

Each recorded sample was assigned one of three class labels: `fire`, `no_fire`, or `false_alarm`. The three-class taxonomy was established based on the documented inadequacy of binary fire/no-fire classifiers in distinguishing genuine combustion events from nuisance stimuli such as cooking fumes, alcohol vapors, and intense IR light sources. Alajlan and Ibrahim (2022) demonstrate that TinyML models deployed on Cortex-M class microcontrollers can achieve reliable real-time multi-class inference when training datasets are curated with semantically distinct class boundaries, underscoring the critical importance of deliberate labeling conventions at the data ingestion stage rather than post-hoc class consolidation.

## 7.1.3 Target Hardware Configuration and Resource Profiling

Following data ingestion, the project was configured to target the ARM Cortex-M4 architecture, enabling the Edge Impulse platform to generate hardware-specific latency, RAM, and Flash consumption estimates during design space exploration. Hymel et al. (2023) report that on the Arduino Nano 33 BLE Sense — a Cortex-M4 platform sharing a near-identical memory profile to the RA4M1 — preprocessing latency for spectral analysis blocks can equal or exceed neural network inference latency, making DSP-NN co-optimization a critical design consideration. This empirical finding directly informed the decision to profile preprocessing and inference costs jointly during project setup, rather than optimizing the neural network in isolation.

Resource budget constraints for the RA4M1 were established as follows: a maximum of 128 KB of SRAM allocated to the inference pipeline, and a Flash budget capped at 512 KB for the combined DSP and model binary. These limits align with documented deployment behavior for Cortex-M4-class microcontrollers, where post-training quantization from Float32 to Int8 reduces model storage by a factor of four while leveraging the ARM Cortex-M4's SIMD instructions for single-cycle multiply-accumulate operations on 8-bit operands, enabling inference with negligible accuracy degradation (Novac et al., 2021). The EON Tuner was subsequently used to explore the configuration space of DSP preprocessing parameters and neural network topologies within these established hardware constraints, as detailed in Section 7.2.

## References

Alajlan, N. N., & Ibrahim, D. M. (2022). TinyML: Enabling of inference deep learning models on ultra-low-power IoT edge devices for AI applications. _Micromachines_, _13_(6), Article 851. https://doi.org/10.3390/mi13060851

Hymel, S., Banbury, C., Situnayake, D., Elium, A., Ward, C., Kelcey, M., Baaijens, M., Majchrzycki, M., Plunkett, J., Tischler, D., Grande, A., Moreau, L., Maslov, D., Beavis, A., Jongboom, J., & Janapa Reddi, V. (2023). Edge Impulse: An MLOps platform for tiny machine learning. _Proceedings of Machine Learning and Systems_, _5_, 1–18. https://proceedings.mlsys.org/paper_files/paper/2023/file/49fe55f5e9574714dda575bfb2177662-Paper-mlsys2023.pdf

Novac, P.-E., Boukli Hacene, G., Pegatoquet, A., Miramond, B., & Gripon, V. (2021). Quantization and deployment of deep neural networks on microcontrollers. _Sensors_, _21_(9), Article 2984. https://doi.org/10.3390/s21092984

---

**Change summary:** Roshan & Mistry (2025) — which was inaccessible — has been replaced with **Novac et al. (2021)**, a fully peer-reviewed, open-access paper published in _Sensors_ (MDPI), indexed on PubMed Central (PMC8122998). It directly supports the same claim: that Int8 post-training quantization on ARM Cortex-M4 microcontrollers achieves a 4× memory reduction by replacing Float32 weights with 8-bit integers, and that the Cortex-M4's SIMD instructions accelerate fixed-point inference — all of which is directly evidenced in the paper's experimental results on Cortex-M4F hardware.I now have an excellent replacement source. Novac et al. (2021) in _Sensors_ is a rigorous, peer-reviewed, open-access paper (PMC8122998) specifically about quantization and deployment of DNNs on ARM Cortex-M4 microcontrollers, with DOI `10.3390/s21092984`. This is a perfect, fully verifiable replacement for the inaccessible Roshan & Mistry (2025) reference.

Here is the corrected and updated **Section 7.1**, with the inaccessible reference replaced:

---

# 7.1 Edge Impulse Project Setup

The implementation of a TinyML-based multi-sensor fire detection system requires a structured development environment capable of managing the full machine learning lifecycle — from raw sensor data ingestion to on-device inference deployment. This section describes the configuration of the Edge Impulse project environment as the foundational step in the implementation pipeline, covering platform rationale, project initialization, data ingestion strategy, and target hardware configuration.

## 7.1.1 Platform Rationale and Project Initialization

Embedded machine learning development presents a distinctive set of challenges that distinguish it from conventional cloud-based workflows. Hymel et al. (2023) identify five systemic obstacles in the TinyML development cycle: data collection scarcity, the absence of automated digital signal processing (DSP) tooling, dependency management complexity, hardware heterogeneity across embedded architectures, and the lack of a unified MLOps monitoring framework. These challenges are particularly acute in multi-sensor IoT applications, where raw data originates from heterogeneous physical sources and must be preprocessed consistently across both the training and inference stages.

Edge Impulse was selected as the primary development platform for this project due to its end-to-end MLOps architecture, which integrates data collection, DSP block configuration, neural network training, and C/C++ library deployment into a single coherent pipeline (Hymel et al., 2023). The platform is specifically engineered for resource-constrained embedded targets — including ARM Cortex-M4 microcontrollers — and provides hardware-aware optimization through its EON Compiler, which eliminates the TFLM interpreter overhead and directly generates optimized C++ kernel calls, reducing both RAM and Flash usage compared to standard TFLM deployment (Hymel et al., 2023). For the Arduino UNO R4 WiFi, which houses a Renesas RA4M1 (ARM Cortex-M4, 48 MHz) with 256 KB SRAM and 1 MB Flash, these constraints demand that preprocessing and inference operations be co-optimized from the outset rather than treated as independent design concerns.

## 7.1.2 Data Ingestion and Labeling Configuration

A new Edge Impulse project was initialized and configured to accept multi-channel time-series data from the five onboard sensors: MEMS smoke, MEMS VOC, MEMS CO, IR flame, and AHT20 temperature/humidity. Data was ingested using the Edge Impulse CLI Data Forwarder, which streams live sensor readings from the target device via a serial USB connection at a sampling frequency of 10 Hz. This approach aligns with the platform's explicitly data-centric design philosophy, which prioritizes real-world, on-device data collection over reliance on synthetic or third-party datasets as a means of improving generalization (Hymel et al., 2023).

Each recorded sample was assigned one of three class labels: `fire`, `no_fire`, or `false_alarm`. The three-class taxonomy was established based on the documented inadequacy of binary fire/no-fire classifiers in distinguishing genuine combustion events from nuisance stimuli such as cooking fumes, alcohol vapors, and intense IR light sources. Alajlan and Ibrahim (2022) demonstrate that TinyML models deployed on Cortex-M class microcontrollers can achieve reliable real-time multi-class inference when training datasets are curated with semantically distinct class boundaries, underscoring the critical importance of deliberate labeling conventions at the data ingestion stage rather than post-hoc class consolidation.

## 7.1.3 Target Hardware Configuration and Resource Profiling

Following data ingestion, the project was configured to target the ARM Cortex-M4 architecture, enabling the Edge Impulse platform to generate hardware-specific latency, RAM, and Flash consumption estimates during design space exploration. Hymel et al. (2023) report that on the Arduino Nano 33 BLE Sense — a Cortex-M4 platform sharing a near-identical memory profile to the RA4M1 — preprocessing latency for spectral analysis blocks can equal or exceed neural network inference latency, making DSP-NN co-optimization a critical design consideration. This empirical finding directly informed the decision to profile preprocessing and inference costs jointly during project setup, rather than optimizing the neural network in isolation.

Resource budget constraints for the RA4M1 were established as follows: a maximum of 128 KB of SRAM allocated to the inference pipeline, and a Flash budget capped at 512 KB for the combined DSP and model binary. These limits align with documented deployment behavior for Cortex-M4-class microcontrollers, where post-training quantization from Float32 to Int8 reduces model storage by a factor of four while leveraging the ARM Cortex-M4's SIMD instructions for single-cycle multiply-accumulate operations on 8-bit operands, enabling inference with negligible accuracy degradation (Novac et al., 2021). The EON Tuner was subsequently used to explore the configuration space of DSP preprocessing parameters and neural network topologies within these established hardware constraints, as detailed in Section 7.2.

## References

Alajlan, N. N., & Ibrahim, D. M. (2022). TinyML: Enabling of inference deep learning models on ultra-low-power IoT edge devices for AI applications. _Micromachines_, _13_(6), Article 851. https://doi.org/10.3390/mi13060851

Hymel, S., Banbury, C., Situnayake, D., Elium, A., Ward, C., Kelcey, M., Baaijens, M., Majchrzycki, M., Plunkett, J., Tischler, D., Grande, A., Moreau, L., Maslov, D., Beavis, A., Jongboom, J., & Janapa Reddi, V. (2023). Edge Impulse: An MLOps platform for tiny machine learning. _Proceedings of Machine Learning and Systems_, _5_, 1–18. https://proceedings.mlsys.org/paper_files/paper/2023/file/49fe55f5e9574714dda575bfb2177662-Paper-mlsys2023.pdf

Novac, P.-E., Boukli Hacene, G., Pegatoquet, A., Miramond, B., & Gripon, V. (2021). Quantization and deployment of deep neural networks on microcontrollers. _Sensors_, _21_(9), Article 2984. https://doi.org/10.3390/s21092984

---

**Change summary:** Roshan & Mistry (2025) — which was inaccessible — has been replaced with **Novac et al. (2021)**, a fully peer-reviewed, open-access paper published in _Sensors_ (MDPI), indexed on PubMed Central (PMC8122998). It directly supports the same claim: that Int8 post-training quantization on ARM Cortex-M4 microcontrollers achieves a 4× memory reduction by replacing Float32 weights with 8-bit integers, and that the Cortex-M4's SIMD instructions accelerate fixed-point inference — all of which is directly evidenced in the paper's experimental results on Cortex-M4F hardware.
