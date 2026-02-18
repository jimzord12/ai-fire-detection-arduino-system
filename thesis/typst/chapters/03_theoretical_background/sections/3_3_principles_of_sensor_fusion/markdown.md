Sensor fusion is critical for improving the reliability of fire detection systems, moving beyond simple thresholds to intelligent discrimination between actual fire events and nuisance alarms like cooking fumes or steam. By mathematically combining data from disparate sources—such as MEMS gas sensors, thermal sensors, and IR flame detectors—the system can achieve a holistic "environmental awareness" that minimizes false positives. [blog.arduino](https://blog.arduino.cc/2023/02/13/using-sensor-fusion-and-tinyml-to-detect-fires/)

## Fusion Levels for TinyML

Sensor fusion is categorized into three hierarchical levels, each offering different trade-offs between information density and computational cost.

- **Data-Level (Low-Level):** Raw sensor signals are combined before any processing. This preserves the maximum amount of information but requires high bandwidth and synchronization, making it computationally intensive for microcontrollers like the Renesas RA4M1. [ijsred](https://ijsred.com/volume8/issue5/IJSRED-V8I5P301.pdf)
- **Feature-Level (Middle-Level):** Independent features (e.g., spectral power, temperature trends) are extracted from each sensor stream and then concatenated into a single vector for classification. This is the most common approach in TinyML (e.g., Edge Impulse) as it balances accuracy with reduced data volume. [docs.edgeimpulse](https://docs.edgeimpulse.com/projects/expert-network/fire-detection-sensor-fusion-arduino-nano-33)
- **Decision-Level (High-Level):** Each sensor or sub-system makes an independent local decision (e.g., "Fire" vs. "No Fire"), and these decisions are then combined using logical rules or probabilistic methods. This level is most suitable for low-latency TinyML applications due to its modularity and minimal RAM requirements, allowing individual sensor modules to operate asynchronously. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC11479314/)

## Bayesian and Probabilistic Methods

Probabilistic frameworks are used to model the inherent uncertainty and noise in environmental sensing.

- **Kalman Filters:** For linear systems with Gaussian noise, Kalman filters provide an optimal recursive estimate by balancing the model's prediction against actual sensor measurements using a "Kalman Gain". In fire detection, they are used to suppress transient noise in temperature and smoke readings, outputting a stabilized probability of fire states. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228805/)
- **Bayesian Networks:** These graphical models represent the conditional dependencies between fire signatures (e.g., "If Flame = True AND CO > Threshold, then P(Fire) increases"). Hierarchical Bayesian models allow the system to reason across multiple abstraction levels, from raw measurement to room-level hazard assessment. [arxiv](https://arxiv.org/abs/1303.2414v1)

## Neural Network Fusion

Multi-input neural networks improve robustness by learning the non-linear correlations between different sensor streams that rule-based systems might miss.

Concatenation layers are used to merge different sensor streams (e.g., gas concentration and IR intensity) into a unified feature map before the final classification layers. This architecture allows the network to recognize patterns such as the simultaneous "slow rise" of temperature and "fast spike" of VOCs characteristic of specific fire types. Using Temporal Convolutional Networks (TCN) for multi-sensor fusion has shown accuracy improvements exceeding 2.5% compared to single-input models, as they can better capture the temporal progression of fire signatures. [blog.arduino](https://blog.arduino.cc/2024/08/08/making-fire-detection-more-accurate-with-ml-sensor-fusion/)

## Conflict Resolution

Conflict resolution addresses scenarios where sensors provide contradictory evidence, such as high heat without a corresponding rise in CO or smoke.

| Method                          | Approach to Conflict                                                                                                                                                                                                          | Suitability for TinyML                                                |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **Dempster-Shafer (DS) Theory** | Uses Basic Probability Assignments (BPA) to quantify the degree of conflict between evidence; redistributes mass to resolve paradoxes [pubmed.ncbi.nlm.nih](https://pubmed.ncbi.nlm.nih.gov/39409495/).                       | High; manages uncertainty without requiring full prior probabilities. |
| **Fuzzy Logic**                 | Employs "if-then" rules with non-binary values (e.g., "Heat is High" but "CO is Low") to determine a risk level [pdfs.semanticscholar](https://pdfs.semanticscholar.org/c60e/e762172b3b81d3f0a6310c8842459b1d8a4c.pdf).       | Very High; extremely lightweight for 8-bit or 32-bit MCUs.            |
| **Two-Level Fusion**            | Uses feature fusion for similar sensors (e.g., two gas sensors) and decision fusion for different types (e.g., gas vs. heat) to filter contradictions [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC11479314/). | Medium; requires more complex architectural design.                   |

In a DS-based system, if the CO sensor indicates "No Fire" but the IR Flame and Temperature sensors indicate "Fire," the theory calculates an "evidence distance" to identify the outlier. If the heat is high but other fire signatures are absent, Fuzzy Logic might classify the event as a "False Alarm" caused by a localized heat source like a toaster. [pdfs.semanticscholar](https://pdfs.semanticscholar.org/c60e/e762172b3b81d3f0a6310c8842459b1d8a4c.pdf)

### References

Arduino. (2024, August 7). _Making fire detection more accurate with ML sensor fusion_. https://blog.arduino.cc/2024/08/08/making-fire-detection-more-accurate-with-ml-sensor-fusion/

Desikan, J., et al. (2025). Dempster Shafer-Empowered Machine Learning-Based Fire Prediction. _IEEE Access_. https://ieeexplore.ieee.org/document/10921730

Githu, S. (2024). _Fire Detection Using Sensor Fusion and TinyML - Arduino Nano 33 BLE Sense_. Edge Impulse Expert Projects. https://edge-impulse.gitbook.io/experts/air-quality-and-environmental-projects/fire-detection-sensor-fusion-arduino-nano-33

Kushwah, A., et al. (2015). Multi-sensor data fusion methods for indoor activity recognition: A review. _Solar Energy_, 115, 123-135. https://doi.org/10.1016/j.solener.2015.02.032

Liu, X., et al. (2022). Research on Multi-Sensor Fusion Indoor Fire Perception Algorithm Based on TCN-APP-SVM. _Sensors_, 22(12), 4522. https://doi.org/10.3390/s22124522

Nekhil, R. (2023). _Using sensor fusion and tinyML to detect fires_. Arduino Blog. https://blog.arduino.cc/2023/02/13/using-sensor-fusion-and-tinyml-to-detect-fires/

Sun, B., et al. (2022). A multi-neural network fusion algorithm for fire warning in urban utility tunnels. _Applied Soft Computing_, 131, 109748. https://doi.org/10.1016/j.asoc.2022.109748

Wang, J., et al. (2024). A Tunnel Fire Detection Method Based on an Improved Dempster-Shafer Evidence Theory. _Sensors_, 24(19), 6432. https://doi.org/10.3390/s24196432

Zhang, Y., et al. (2023). Hybrid Feature Fusion-Based High-Sensitivity Fire Early Warning System. _Sensors_, 23(2), 793. https://doi.org/10.3390/s23020793
