# 3.3 Principles of Sensor Fusion for Discrimination

The reliable discrimination of fire events from nuisance scenarios requires that measurements from heterogeneous sensing modalities be combined in a principled manner. No single physical transducer can simultaneously capture the spectral, chemical, and thermal signatures that jointly characterise combustion while remaining immune to confounding stimuli such as cooking fumes, steam, or cleaning-product vapours (Li et al., 2022). Sensor fusion addresses this limitation by integrating correlated yet complementary data streams into a unified decision framework, thereby reducing uncertainty and improving both sensitivity and specificity. The following subsections survey the principal fusion architectures—statistical inference methods and neural network-based methods—and examine their applicability to the three-class discrimination problem (fire / no_fire / false_alarm) pursued in this work.

## 3.3.1 Statistical and Inference-Based Fusion

Statistical methods fuse sensor readings by modelling the probabilistic relationships between observed measurements and underlying physical states. Among the earliest and most widely deployed approaches is the **Kalman filter**, which maintains a recursive Bayesian estimate of the system state and has been applied to multi-sensor fire detection to output continuous probabilities for _no-fire_, _flaming_, and _smouldering_ conditions (Li et al., 2022). Because the Kalman filter assumes linear dynamics and Gaussian noise, its accuracy degrades under the highly non-linear, transient conditions typical of early-stage ignition; extensions such as the Extended Kalman Filter or the Unscented Kalman Filter partially address this limitation.

**Bayesian estimation** generalises the Kalman framework to arbitrary prior distributions and has been employed in multiple-detector alarm systems to compute the posterior probability of a true fire event given partial or noisy evidence from spatially distributed detectors (Chen et al., 2023). Chen et al. (2023) demonstrated that a Bayesian network integrating smoke concentration readings from several co-located detectors substantially reduced the false-alarm rate relative to any individual detector acting alone, because joint improbability of simultaneous nuisance excitation across all channels is far lower than for a single channel. **Fuzzy logic** represents a third statistical paradigm: membership functions map crisp sensor readings to linguistic variables (_low_, _medium_, _high_), and rule bases encode expert knowledge about fire signatures, yielding outputs that naturally accommodate sensor uncertainty without requiring strict distributional assumptions (Li et al., 2022).

A common weakness of purely statistical methods is their limited ability to capture the complex non-linear coupling between heterogeneous sensor modalities—particularly when the number of sensed physical quantities grows beyond two or three (Li et al., 2022). They also require explicit a priori models of sensor noise and fire dynamics, which can be difficult to obtain experimentally.

## 3.3.2 Neural Network-Based Fusion

Neural network approaches learn the fusion mapping directly from labelled data, making them better suited to high-dimensional, non-linearly coupled sensor spaces. **Back-Propagation Neural Networks (BPNN)** were among the first neural architectures applied to multi-sensor fire classification, fusing smoke, CO, and temperature streams into a scalar fire-probability output; however, BPNNs are prone to local minima and struggle to represent temporal dynamics in sensor trajectories (Deng et al., 2023).

**Recurrent and convolutional architectures** overcome this shortcoming by explicitly modelling temporal structure. Li et al. (2022) proposed a TCN-AAP-SVM pipeline in which an improved Temporal Convolutional Network (TCN) first extracts time-series features from fused smoke, CO, and temperature streams; an Adaptive Average Pooling (AAP) layer then reduces feature dimensionality without trainable parameters, and a Support Vector Machine (SVM) classifier with a Gaussian Radial Basis Function kernel performs the final three-class discrimination (_no-fire_, _flaming_, _smouldering_). On the NIST residential fire dataset this architecture achieved 97.49% accuracy—outperforming plain TCN (94.99%), LSTM (94.74%), and BPNN (88.54%) variants—while also improving training speed by up to 50% and inference speed by up to 52% relative to BPNN (Li et al., 2022). The key insight is that **trend extraction** via the Mann–Kendall algorithm, applied as a preprocessing step, makes slow-onset smouldering events linearly distinguishable from idle no-fire periods that would otherwise appear identical to a stationary classifier.

Convolutional networks applied directly to time-series imagery extend this principle further. Deng et al. (2023) pre-processed heterogeneous smoke, CO, and temperature streams with a **Gramian Angular Field (GAF)** transform, which encodes each univariate time series as a square correlation matrix preserving temporal dependencies, then stacked the three channel matrices into a single three-dimensional tensor fed to a lightweight ConvNeXt-FiRe network. This design achieved 99.1% accuracy on a combined simulated-plus-real dataset while keeping parameter count below 400 K—well within the memory budget of resource-constrained embedded platforms (Deng et al., 2023).

## 3.3.3 Decision-Level and Hybrid Fusion

Beyond feature-level fusion, **decision-level** architectures combine the independent outputs of per-modality classifiers using rules, weighted voting, or Dempster–Shafer evidence theory. Such schemes are attractive for modular system design because each sub-classifier can be developed and validated independently; a downstream combiner then arbitrates conflicting evidence. Their primary limitation is the loss of cross-modal correlation information that occurs when each modality is processed in isolation before combination (Deng et al., 2023).

**Hybrid** approaches—combining heuristic threshold triggers with a trained probabilistic classifier—are particularly relevant to embedded deployments. By requiring simultaneous satisfaction of a hard threshold on a _truth sensor_ (e.g., CO concentration confirming combustion) and a sufficiently high ML-derived fire probability, hybrid logic prevents either component from acting as a single point of failure. This strategy is directly applicable to the present system's post-processing pipeline, wherein the neural-network inference score is gated by rule-based checks on IR flame presence and CO level before an alarm is raised.

---

## References

Chen, X., Zhang, R., Li, Y., & Wang, J. (2023). A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation. _Fire Safety Journal_, _136_, 103971. https://doi.org/10.1016/j.firesaf.2023.103971

Deng, X., Shi, X., Wang, H., Wang, Q., Bao, J., & Chen, Z. (2023). An indoor fire detection method based on multi-sensor fusion and a lightweight convolutional neural network. _Sensors_, _23_(24), 9689. https://doi.org/10.3390/s23249689

Li, Y., Su, Y., Zeng, X., & Wang, J. (2022). Research on multi-sensor fusion indoor fire perception algorithm based on improved TCN. _Sensors_, _22_(12), 4550. https://doi.org/10.3390/s22124550

---

## Glossary

- **Kalman Filter**: A recursive Bayesian algorithm that estimates the state of a linear dynamic system from noisy measurements by alternating prediction and update steps.
- **Bayesian Estimation**: A statistical inference framework that updates the probability of a hypothesis as new evidence is observed, using Bayes' theorem.
- **Temporal Convolutional Network (TCN)**: A convolutional neural network architecture designed for sequence modelling that uses causal, dilated convolutions to capture long-range temporal dependencies without recurrence.
- **Gramian Angular Field (GAF)**: A time-series encoding method that maps a univariate sequence to a square matrix of pairwise angular correlations, preserving temporal structure for use with image-classification networks.
- **Dempster–Shafer Evidence Theory**: A generalisation of Bayesian reasoning that assigns belief mass to sets of hypotheses and combines independent sources of evidence using Dempster's combination rule.
- **Support Vector Machine (SVM)**: A maximum-margin classifier that finds the hyperplane in a high-dimensional feature space that separates classes with the greatest geometric margin, optionally using kernel functions for non-linear boundaries.
