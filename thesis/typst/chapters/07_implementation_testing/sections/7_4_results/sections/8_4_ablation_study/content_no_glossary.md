# Ablation Study


## 8.4.1 Performance Comparison: Single Sensor vs. Fusion Model

The fundamental premise of this thesis is that sensor fusion significantly outperforms single-sensor detection in complex fire detection environments. While individual sensors provide valuable information, they often suffer from ambiguity and susceptibility to false positives. The ablation study indirectly confirms this by demonstrating the complete separability of classes only when all sensors are considered.


In contrast, the fusion model, which integrates `smoke`, `voc`, `co`, `flame`, `temp`, and `hum` data, achieved a perfect **100% accuracy** on the validation set (as shown in Section 8.3 and `analysis_results.json`). This indicates that while individual sensors may exhibit overlapping response ranges, their combined signature in a multi-dimensional feature space allows the machine learning model to draw clear decision boundaries. The high `feature_importance` values across multiple sensors (Smoke: 33.5%, VOC: 18.2%, CO: 15.6%, Flame: 15.5%, Temp: 14.1%) further underscore that the model relies on a collective input, rather than a single dominant sensor, to achieve its high performance. This collective reliance is the direct benefit of sensor fusion.

## 8.4.2 The "Heat Paradox": Why Single-Sensor Thermal Detection Fails in False Alarm Scenarios


This paradox is pivotal:
*   **Limitation of Single-Sensor Thermal Detection**: A system relying solely on a fixed temperature threshold for fire detection would be highly prone to false alarms from common nuisance sources like cooking or hot showers. A high temperature reading alone could lead to an alarm even in the absence of a genuine fire.
*   **Validation of Multi-Sensor Approach**: This finding strongly validates the necessity of a multi-sensor fusion approach. By incorporating additional sensor modalities (e.g., CO, smoke, flame), the system can contextualize the temperature anomaly. A high temperature reading, when accompanied by low CO levels and no significant flame signature, can be correctly identified as a false alarm, even if it exceeds the temperature of an early-stage fire. This prevents nuisance alarms that would otherwise occur with single-sensor thermal systems.

## 8.4.3 Identifying the "CO Truth Sensor" for Combustion Verification


*   **Distinctive Signature**: While `smoke` and `voc` sensors showed elevated readings for both "fire" and "false_alarm" classes (e.g., from cooking fumes or aerosol sprays), the CO sensor exhibited a massive divergence. In "fire" scenarios, CO levels averaged ~494, whereas in "false_alarm" scenarios, they dropped significantly to ~123. This clear separation makes CO an invaluable discriminator.
*   **Role in False Alarm Mitigation**: If smoke and/or VOC levels are high but CO remains low, the system can confidently classify the event as a "false_alarm" rather than a life-threatening "fire." This heuristic is embedded implicitly in the machine learning model's learned decision boundaries and explicitly in the hybrid triggering logic (`visualConfirmation`) where CO data contributes to the overall model prediction. The CO sensor effectively provides a "sanity check" for combustion, preventing nuisance alarms from sources that produce particulate matter or volatile organic compounds but not significant CO.

## 8.4.4 Proof of "Fusion" Benefit

The ablation study, through these insights, conclusively proves the benefit of sensor fusion. The 100% classification accuracy achieved by the multi-sensor model on the validation dataset (as discussed in Section 8.3) stands in stark contrast to the inherent ambiguities and limitations of single-sensor detection.

*   **Complementary Information**: Each sensor contributes unique, complementary information. Smoke and VOCs provide early warning for particulate and chemical emissions. Flame confirms the presence of open fire. Temperature and humidity offer environmental context. Crucially, CO provides definitive proof of combustion.
*   **Robust Discrimination**: By fusing these diverse inputs, the system overcomes the individual weaknesses of each sensor. The model can accurately differentiate between highly similar sensor patterns (e.g., high smoke/VOCs in both fire and cooking) by identifying the subtle but critical differences in other modalities (e.g., CO levels). This synergistic effect leads to a robust fire detection system with a significantly reduced false alarm rate, fulfilling a key objective of this thesis. The absence of any misclassifications in the confusion matrix (`thesis/assets/figures/data_analysis/confusion_matrix.png`) further reinforces this proof of fusion benefit.

### References


