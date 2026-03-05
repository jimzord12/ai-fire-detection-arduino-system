== Analysis of Error Cases

While the multi-sensor fusion model achieves 100% accuracy on the current validation dataset, it is critical to analyze potential error cases and edge scenarios that could challenge the system's reliability in more diverse or unpredictable environments. This section explores the theoretical vulnerabilities of the model, focusing on the "lab-to-real-world gap," sensor-level failures, and the impact of extreme environmental variance.

=== The "Lab-to-Real-World" Gap

The current model is trained on a dataset collected in controlled settings. An "error case" could arise if the system is deployed in an environment with chemical background signatures significantly different from those in the training set. For instance, a high-density industrial environment with constant background levels of specific VOCs or particulates might cause the "no_fire" class to shift, potentially leading to a persistent "false alarm" classification or, conversely, a reduction in sensitivity to genuine fire events. This highlights the importance of environmental variance in the data collection methodology (Section 6.5) and the need for site-specific calibration.

=== Sensor-Level Ambiguity and Fusion Limitations

Despite the strength of sensor fusion, certain physical conditions can still introduce ambiguity:

- *Infrared Interference*: While temporal flicker analysis mitigates static IR noise, extreme high-frequency IR interference (e.g., from rapidly flickering high-intensity arc lamps or specific industrial machinery) could theoretically mimic a flame signature. If this coincided with a localized VOC spike (e.g., from a nearby chemical process), the model might misclassify the event as a fire.
- *Obscured Sensing*: If the IR flame sensor's field of view is completely obstructed while a smoldering fire begins, the system would rely entirely on its gas and thermal channels. While the model is designed to handle such redundancy, the loss of the optical modality might increase the time-to-first-detection or slightly reduce the confidence level of the classification.
- *Extreme Cross-Sensitivity and Compound Nuisances*: Although the CO sensor acts as a "truth sensor," a scenario involving a significant CO release without a fire (e.g., a faulty combustion heater or vehicle exhaust entering a building) combined with a high-particulate nuisance (e.g., dust from construction) could potentially fool the model. Furthermore, the system must be evaluated against **compound false alarm scenarios**, where multiple nuisance sources occur simultaneously. For instance, the combination of high-humidity cooking steam and a localized alcohol-based cleaning spray could create a "chemical noise floor" that mimics the multi-modal VOC and humidity signature of an incipient fire @pathan2024multisensory. While the absence of CO and flame flicker should theoretically prevent an alarm, the combined variance could push the TinyML model into a region of high uncertainty.

=== Impact of Sensor Drift and Aging

Metal-oxide (MOS) sensors are subject to long-term drift and sensitivity loss as they age. If a sensor's baseline shifts significantly over several months, the engineered features (like windowed mean) would no longer accurately reflect the original training distribution. Without a dynamic, adaptive baseline algorithm in the firmware, this drift could eventually lead to increased misclassifications. This analysis underscores the "Future Work" (Section 10.4) requirement for robust, on-device baseline management and over-the-air (OTA) model updates to maintain safety integrity over the system's operational lifespan.
