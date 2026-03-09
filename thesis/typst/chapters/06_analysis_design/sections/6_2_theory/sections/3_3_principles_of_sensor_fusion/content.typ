== Principles of Sensor Fusion for Discrimination

Sensor fusion is the process of integrating data from multiple heterogeneous sensors to produce information that is more accurate, reliable, and comprehensive than that provided by any single sensor in isolation. In the context of fire detection, sensor fusion addresses the inherent ambiguities of individual modalities—such as the susceptibility of photoelectric sensors to steam or the line-of-sight limitations of infrared sensors—by identifying cross-sensor correlations that characterize a genuine fire event.

=== Hierarchical Levels of Fusion

Sensor fusion can be categorized into three hierarchical levels based on the stage at which the data is combined: data-level (early fusion), feature-level, and decision-level (late fusion).

==== Data-Level and Feature-Level Fusion

Data-level fusion involves the direct integration of raw sensor signals. This approach preserves the highest degree of information but requires significant bandwidth and computational resources, as the fusion center must process high-dimensional raw data. Feature-level fusion, which is the primary approach used in this research, involves extracting relevant characteristics (features) from each sensor modality—such as mean gas concentration, thermal gradients, or the frequency components of a flame signal—before combining them into a single feature vector @pathan2024multisensory. This vector then serves as the input for a machine learning classifier. Feature fusion is particularly effective for TinyML applications, as it reduces the input dimensionality while preserving the discriminatory patterns necessary for accurate classification @sailesh2022novel.

==== Decision-Level Fusion

Decision-level fusion involves combining the independent outputs of multiple classifiers or heuristic rules. In the autonomous node, this manifests as the integration of TinyML model probabilities with hard threshold checks from specific "truth sensors." For example, a "fire" classification from the neural network may only trigger a high-confidence alarm if it is confirmed by a secondary heuristic, such as a localized CO spike or a persistent flame flicker signal @LIU2023103733. This hybrid approach enhances the system's robustness against transient sensor noise and isolated model errors.

=== Redundant and Complementary Fusion

The effectiveness of fusion in the fire detection domain relies on both redundant and complementary sensor configurations.

- *Redundant Fusion*: Multiple sensors of the same or similar types (e.g., Smoke and VOC sensors) monitor the same phenomenon. This provides fault tolerance and improves the signal-to-noise ratio, as a genuine fire will typically influence multiple sensors simultaneously @meleti2024obscured.
- *Complementary Fusion*: Sensors monitor different, yet related, physical phenomena (e.g., gas concentration vs. IR radiation). Complementary fusion is critical for false alarm rejection. As identified in the data analysis, the CO sensor acts as a "truth sensor" because its readings are rarely elevated in non-combustion scenarios like cooking steam, effectively contextualizing high smoke readings @salhi2024early.

=== Non-Linear Discrimination via Machine Learning

Traditional fusion systems often rely on simple weighted averages or static rule-based logic. However, the complex, time-varying relationships between sensor modalities during a fire event are often non-linear. Modern intelligent edge nodes utilize machine learning—specifically neural networks—to learn these high-dimensional decision boundaries. By training on diverse datasets that include "fire," "no_fire," and specific "false_alarm" scenarios, the model can identify subtle patterns, such as the relationship between rising temperature and stable CO levels, to distinguish a kitchen's ambient heat from an incipient fire @pathan2024multisensory.
