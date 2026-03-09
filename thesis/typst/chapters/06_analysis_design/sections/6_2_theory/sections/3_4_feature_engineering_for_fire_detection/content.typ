== Feature Engineering for Fire Detection

Feature engineering constitutes the process of transforming raw, high-frequency sensor time series into compact, discriminative representations that maximise a classifier's ability to separate fire, no_fire, and false-alarm conditions. Because the five modalities employed in this system—smoke, VOC, CO, IR flame, and temperature/humidity—each evolve at different temporal scales and carry distinct physical information, an effective feature set must span the time domain, the frequency domain, and the inter-sensor relational space.

=== Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends

The most direct description of a sensor window is a set of first- and higher-order statistical moments computed over the raw readings. For gas and thermal channels that evolve slowly relative to the sampling period, these time-domain summary statistics encode the magnitude, energy, and distributional shape of the signal trajectory associated with each combustion state.

The arithmetic mean captures the average concentration or temperature level within a sliding window. During fire events, CO and VOC readings rise monotonically, so the windowed mean reflects cumulative combustion product build-up. Research has shown that CO and VOC are the most discriminative early-fire indicators in gas-sensor arrays, precisely because their mean concentrations diverge from ambient baselines well before smoke particles become detectable @fonollosa2018chemical. During nuisance scenarios such as cooking fumes or alcohol evaporation, VOC means also rise, but CO means do not, creating a separable mean-feature vector across classes—a property this project exploits for three-class discrimination.

The root-mean-square (RMS) value integrates signal magnitude with energy content, and is particularly informative when a channel alternates between elevated and baseline readings within a window, as occurs during intermittent heating or transient cooking events. Studies have adopted energy-normalised representations for multi-sensor gas data, reporting that energy-level features substantially reduced false-alarm confusion between cooking and genuine fire states @kim2024multi.

Kurtosis quantifies the "tailedness" of the sample distribution; a high kurtosis indicates sharp, impulsive deviations from the mean, characteristic of sudden ignition transients, whereas a kurtosis near 3 (mesokurtic) reflects smooth or Gaussian variation typical of ambient or cooking conditions. Empirical verification has shown that in multi-stage feature-selection using VOC, CO2, and temperature sensors for incipient fire classification, higher-order statistical features (including kurtosis-derived variants) increased classifier accuracy beyond what was achievable with mean-only features @zakaria2016multi.

=== Frequency-Domain Features (FFT/Spectral Power) for Flame Flicker

Turbulent diffusion flames exhibit a characteristic luminous flickering caused by the periodic shedding of toroidal vortices at the flame base. This phenomenon produces oscillations in both radiated infrared intensity and, indirectly, in local gas concentrations at a frequency band of approximately 1–15 Hz, with the dominant puffing frequency of small uncontrolled flames concentrated near 10–13 Hz @fonollosa2018chemical.

The Fast Fourier Transform (FFT) converts a windowed time-series segment into its frequency-domain representation. From the complex spectrum, the spectral power in a band of interest is obtained. For the IR flame sensor channel, energy concentrated in the 10–15 Hz band is a strong positive indicator of a genuine flame, because static heat sources (e.g., cooking hotplates) and direct sunlight do not produce periodic oscillations in this band @fonollosa2018chemical.

Beyond band energy, additional spectral descriptors extracted from the FFT magnitude spectrum improve discriminability, such as the spectral centroid, spectral entropy, and peak frequency. Research has demonstrated that multi-sensor fire detection systems benefit from trend- and frequency-based feature extraction, showing that temporal pattern features derived from gas sensor signals improved model accuracy by reducing confusion with non-fire thermal events @wu2021multi.

=== Cross-Sensor Correlations and Dimensionality Reduction

The strongest discriminative signal in a multi-modal system often resides in the relationships between channels. During genuine combustion, CO, VOC, temperature, and IR intensity co-vary in a physically constrained manner: CO and VOC concentrations both rise because they share the same combustion source, temperature increases as a consequence of heat release, and IR intensity fluctuates at the flicker frequency @fonollosa2018chemical.

#figure(
  image("../../../../../../assets/figures/data_analysis/sensor_correlation.png", width: 80%),
  caption: [Sensor Correlation Matrix. A heatmap showing the Pearson correlation coefficients between the six sensors. Low correlation between certain sensors (e.g., CO and Humidity) indicates they provide unique, non-redundant information for the fusion model.],
) <fig-sensor-correlation>

Pearson's cross-correlation coefficient between channels provides a windowed coupling measure that is physically interpretable and computationally inexpensive. However, computing all pairwise correlations across multiple sensor channels yields a high-dimensional feature vector. Principal Component Analysis (PCA) addresses this by projecting the feature matrix onto its eigenvectors of maximum variance, retaining only the components needed to explain most of the total variance while discarding redundant or noisy dimensions. Studies have demonstrated this benefit directly in incipient fire detection, where PCA reduced feature dimensionality without information loss and improved classification accuracy @zakaria2016multi.

Alternative supervised dimensionality reduction methods, such as Linear Discriminant Analysis (LDA), maximize between-class scatter relative to within-class scatter. These methods are essential for generalizing learned multi-sensor fire signatures across different environments @vorwerk2024classification. In the context of this project, PCA is used to reduce the combined feature vector to a fixed-length input for the neural network classifier.
