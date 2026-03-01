# False Alarm Mitigation and Research Synthesis

## 2.4.1 Strategies for Handling Cooking/Nuisance Scenarios

False alarms pose a significant challenge to the effectiveness and public acceptance of fire detection systems. They can lead to complacency, unnecessary evacuations, disruption of daily activities, and considerable financial costs [1]. A major source of these nuisance alarms stems from common household or industrial activities such as cooking, steam from showers, aerosol sprays, and dust. Traditional single-sensor detectors, particularly ionization and photoelectric smoke alarms, often struggle to differentiate between these phenomena and actual fire signatures due to their limited sensory input [2].

To mitigate false alarms from cooking and other nuisance scenarios, various strategies have been explored in the literature:

1.  **Multi-Sensor Fusion**: The most prevalent approach involves combining data from multiple sensor types (e.g., smoke, heat, CO, VOC, IR flame). By analyzing complementary fire indicators, systems can build a more comprehensive profile of an event. For instance, cooking fumes typically produce smoke and VOCs but little to no CO, whereas a real fire will generate significant CO. Algorithms ranging from simple logical gates to complex machine learning models interpret these fused signals to enhance discrimination [3].
2.  **Advanced Signal Processing**: Beyond raw sensor values, extracting features like rate-of-rise of temperature, flicker frequency of IR, or transient patterns in gas concentrations can provide more robust fire signatures. Digital signal processing techniques can differentiate between the slow, sustained changes of a nuisance event versus the rapid, dynamic changes of a fire [4].
3.  **Contextual Awareness**: Incorporating environmental context, such as time of day (e.g., increased cooking activity during meal times), historical data, or even occupancy information, can help systems make more informed decisions. For instance, a smoke alarm in a kitchen during dinner time might be treated with more skepticism if CO levels remain normal.
4.  **Adaptive Thresholds**: Instead of fixed thresholds, some systems employ adaptive algorithms that adjust detection parameters based on ambient conditions or learned patterns of normal activity [5]. This allows for greater sensitivity in quiescent periods and higher resilience to nuisance events during predictable disturbances.

## 2.4.2 Gap Analysis: Why 3-Class Classification is Needed

Despite advancements in multi-sensor fusion and advanced signal processing, many conventional intelligent fire detection systems still operate on a binary classification paradigm: "fire" or "no-fire." While this improves upon single-sensor units, it implicitly groups all non-fire events, including false alarms, into a single "no-fire" category. This simplification overlooks the distinct characteristics of common nuisance events, which often have unique multi-sensor signatures that differ from both true fires and normal ambient conditions.

The critical gap identified in current approaches is the lack of explicit differentiation between various "no-fire" scenarios. False alarms from cooking, steam, or aerosols are not merely "absence of fire"; they are distinct events with characteristic sensor patterns (e.g., high smoke/VOCs, but low CO and specific temperature profiles). By lumping them into a generic "no-fire" class, valuable information is lost, and the system is forced to learn a less precise decision boundary, leading to persistent false positives.

*   **Improve Specificity**: By distinguishing false alarms from ambient conditions, the system becomes more specific to actual fire events.
*   **Enhance Robustness**: The model can learn distinct feature spaces for each of the three classes, leading to more stable and reliable detection.
*   **Enable Contextual Responses**: Differentiating between a "no_fire" (ambient) state and a "false_alarm" state can enable different system responses (e.g., a "false_alarm" might trigger a local notification to check the area, while a "fire" triggers a full alarm).

## 2.4.3 Comparison Table of Related Works

A comprehensive review of related works often highlights various sensor combinations, fusion algorithms, and deployment scenarios. While many studies address false alarm reduction, few explicitly implement and demonstrate a robust three-class classification at the edge to tackle the "false_alarm" category directly as a distinct state.

| Reference                                      | Sensors Utilized                         | Fusion Technique               | Classification Classes       | Edge Deployment | False Alarm Strategy                                |
| :--------------------------------------------- | :--------------------------------------- | :----------------------------- | :--------------------------- | :-------------- | :---------------------------------------------------- |
| [5]             | Smoke [6]     | Smoke, Heat, CO, VOC, IR                 | Deep Learning [7]     | Temperature, Smoke, Gas                  | Ensemble Learning              | Fire/No-Fire                 | Yes             | Advanced algorithmic discrimination                 |
| [4]                            | Image processing (IR/Visible Light)      | Image processing algorithms    | Fire/No-Fire                 | No              | Focus on flame flicker patterns                   |
| This Thesis Project                          | Smoke, Heat, CO, VOC, IR (5x DFRobot MEMS) | TinyML (CNN/Random Forest)     | Fire/No-Fire/False_Alarm     | Yes (Arduino UNO R4) | Explicit 3-class classification, CO "Truth Sensor"        |

This comparison underscores the novel contribution of this thesis in explicitly targeting three-class classification on a resource-constrained edge device, filling a critical gap in robust false alarm mitigation.


Chou, P. Y., Huang, H. S., & Fan, T. C. (2017). False alarm reduction of fire detection systems in harsh environments. *Sensors, 17*(10), 2267.

Intelligent Fire Detection Systems Using Deep Learning and Multi-Sensor Data Fusion. (2025). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

Multi-sensor data fusion algorithm for indoor fire detection based on ensemble learning. (2024). *Journal Name*, *Volume*(Issue), pages. (Note: Full reference details were not provided in the search result for this paper. Placeholder used.)

National Fire Protection Association. (2021). *NFPA 72: National Fire Alarm and Signaling Code*.

Tavakkoli Moghaddam, E., Ebadi, A., & Safarpour, H. (2023). A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation. _Fire Safety Journal_, _136_, 103988.

Wang, Y., & Wang, Y. (2017). Research on fire detection technology based on image processing. _International Journal of Signal Processing, Image Processing and Pattern Recognition_, _10_(5), 183-194.

### References

- [1] UNKNOWN (APA - No Full Match): (Chou et al., 2017)
- [2] UNKNOWN (APA - No Full Match): (National Fire Protection Association, 2021)
- [3] UNKNOWN (APA - No Full Match): (Intelligent Fire Detection Systems, 2025; Multi-sensor data fusion algorithm, 2024)
- [4] UNKNOWN (APA - No Full Match): (Wang & Wang, 2017)
- [5] UNKNOWN (APA - No Full Match): (Tavakkoli Moghaddam et al., 2023)
- [6] UNKNOWN (APA - No Full Match): (multiple)                         | Bayesian Estimation            | Fire/No-Fire                 | No              | Probability adjustment based on multiple smoke detectors |
| (Intelligent Fire Detection Systems, 2025)
- [7] UNKNOWN (APA - No Full Match): (CNNs)           | Fire/No-Fire                 | Yes             | Implicitly through complex feature learning           |
| (Multi-sensor data fusion algorithm, 2024)