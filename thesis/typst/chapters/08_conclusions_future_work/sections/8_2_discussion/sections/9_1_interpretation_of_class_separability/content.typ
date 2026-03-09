=== Interpretation of Class Separability

The efficacy of a multi-sensor fire detection system hinges on its ability to clearly differentiate between distinct environmental states: true fire, ambient "no-fire" conditions, and various "false alarm" scenarios. Our analysis confirms that these three classes are mathematically separable when viewed through the high-dimensional feature space provided by sensor fusion. This section interprets the physical and statistical basis for this separability, focusing on the critical roles played by Carbon Monoxide (CO) as a "truth sensor" and the interpretation of thermal anomalies.

==== The "CO Truth Sensor" and Combustion Verification

The most significant finding in the interpretation of class separability is the unique role of the Carbon Monoxide (CO) sensor. Unlike other gas sensors, the CO sensor exhibits a "truth sensor" behavior: its readings only significantly deviate from the baseline during genuine combustion events.

During smoldering or flaming fire scenarios, CO is a primary byproduct of incomplete combustion, resulting in a monotonic and sustained rise in sensor voltage. In contrast, common false alarm triggers—such as alcohol-based cleaning sprays or cooking steam—which can cause significant spikes in Volatile Organic Compound (VOC) and particulate smoke readings, do not produce a corresponding CO signature. This physical reality allows the TinyML model to learn a decision boundary that effectively "vetoes" alarms from other sensors if not accompanied by a CO rise, thus providing a high degree of confidence in fire detection.

==== The "Heat Paradox" and Thermal Anomaly Analysis

Thermal data, while intuitive, presents a "heat paradox" that can lead to false positives if used in isolation. In several "false alarm" scenarios, particularly those related to cooking activities near the sensor, the localized temperature rise was observed to be higher and more rapid than during the incipient stages of a genuine wood or paper fire.

A traditional threshold-based detector would fail in this scenario, either triggering a false alarm or requiring a threshold so high that it misses early-stage fires. However, by fusing temperature with gas concentration trends, the system identifies this as a "thermal anomaly" without chemical correlation. The model recognizes that a sharp temperature spike unaccompanied by CO or specific VOC signatures is characteristic of an ambient heat source (like a toaster or stove) rather than a developing fire. This multi-modal interpretation allows the system to maintain high sensitivity to the low-heat signatures of early-stage smoldering while robustly rejecting high-heat nuisance events.

==== Statistical Basis for Multi-Class Separability

Statistical exploration of the dataset, including correlation analysis and feature importance mapping, further supports this physical interpretation. Feature importance rankings indicate that while smoke and VOC sensors are the primary indicators of a change in state, their correlation with CO and the temporal flicker of the IR flame sensor are what define the "Fire" class.

By training on an explicit "False Alarm" class, the model does not merely treat nuisance events as "noisy background" but learns them as distinct statistical patterns. This transition from binary detection to three-class classification significantly expands the decision space, allowing the system to achieve 100% separability on the test set. While individual sensors may be misleading, their intelligent fusion provides a rich and separable feature space, allowing the TinyML model to achieve highly accurate and reliable distinction between fire, no-fire, and false alarm events.
