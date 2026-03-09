# 3.4 Feature Engineering for Fire Detection

Feature engineering constitutes the process of transforming raw, high-frequency sensor time series into compact, discriminative representations that maximise a classifier's ability to separate fire, no-fire, and false-alarm conditions. Because the five modalities employed in this system—smoke, VOC, CO, IR flame, and temperature/humidity—each evolve at different temporal scales and carry distinct physical information, an effective feature set must span the time domain, the frequency domain, and the inter-sensor relational space. The subsections that follow address each of these three representational planes in turn, establishing the theoretical justification for every feature family selected for this project.

---

## 3.4.1 Statistical Analysis (Mean, RMS, Kurtosis) for Gas/Thermal Trends

The most direct description of a sensor window is a set of first- and higher-order statistical moments computed over the raw readings. For gas and thermal channels that evolve slowly relative to the sampling period, these time-domain summary statistics encode the magnitude, energy, and distributional shape of the signal trajectory associated with each combustion state.

The **arithmetic mean** \(\bar{x} = \frac{1}{N}\sum\_{i=1}^{N} x_i\) captures the average concentration or temperature level within a sliding window. During fire events, CO and VOC readings rise monotonically, so the windowed mean reflects cumulative combustion product build-up. Fonollosa et al. (2018) showed that CO and VOC are the most discriminative early-fire indicators in gas-sensor arrays, precisely because their mean concentrations diverge from ambient baselines well before smoke particles become detectable. During nuisance scenarios such as cooking fumes or alcohol evaporation, VOC means also rise, but CO means do not, creating a separable mean-feature vector across classes—a property this project exploits for three-class discrimination.

The **root-mean-square** (RMS) value \(\text{RMS} = \sqrt{\frac{1}{N}\sum\_{i=1}^{N} x_i^2}\) integrates signal magnitude with energy content, and is particularly informative when a channel alternates between elevated and baseline readings within a window, as occurs during intermittent heating or transient cooking events. Kim et al. (2024) adopted a smoothed moving-average pre-processing step before statistical feature extraction from multi-sensor gas data, effectively computing an energy-normalised representation equivalent to a windowed RMS, and reported that energy-level features substantially reduced false-alarm confusion between cooking and genuine fire states.

**Kurtosis** \(\kappa = \frac{1}{N}\sum\_{i=1}^{N}\left(\frac{x_i - \bar{x}}{\sigma}\right)^4\) quantifies the "tailedness" of the sample distribution; a high kurtosis indicates sharp, impulsive deviations from the mean, characteristic of sudden ignition transients, whereas a kurtosis near 3 (mesokurtic) reflects smooth or Gaussian variation typical of ambient or cooking conditions. Zakaria et al. (2016) verified this property empirically: in a multi-stage feature-selection study using VOC, CO₂, and temperature sensors for incipient fire classification, higher-order statistical features (including kurtosis-derived variants) increased classifier accuracy beyond what was achievable with mean-only features, and their PCA–PNN system achieved a maximum accuracy of 99.02% on the IAQ dataset when higher-order features were included.

Together, mean, RMS, and kurtosis form an orthogonal statistical triplet that describes the level, energy, and impulsiveness of each sensor channel. Because these features are computed from windowed data at 10 Hz, they remain computationally tractable on the Renesas RA4M1 Cortex-M4 core, satisfying the real-time constraint of this project.

---

## 3.4.2 Frequency-Domain Features (FFT/Spectral Power) for Flame Flicker at 10–15 Hz

Turbulent diffusion flames exhibit a characteristic luminous flickering caused by the periodic shedding of toroidal vortices at the flame base. This phenomenon, well-described in the fluid-dynamics literature, produces oscillations in both radiated infrared intensity and, indirectly, in local gas concentrations at a frequency band of approximately 1–15 Hz, with the dominant puffing frequency of small uncontrolled flames concentrated near 10–13 Hz (Cetegen & Ahmed, 1993, as cited in the fire-detection literature). Yoksis et al. (2012) confirmed experimentally that the turbulent flame flicker process is a wideband activity from 1 to 13 Hz and adopted a sampling rate of 50 Hz specifically to satisfy the Nyquist criterion of twice the maximum flicker frequency; this sampling design principle directly informs the 10 Hz minimum acquisition rate chosen for the IR flame channel in this project (Bilkent University, 2012).

The **Fast Fourier Transform** (FFT) converts a windowed time-series segment \(x[n]\) of length \(N\) into its frequency-domain representation:

\[X[k] = \sum\_{n=0}^{N-1} x[n]\, e^{-j 2\pi kn/N}, \quad k = 0, 1, \ldots, N-1\]

From the complex spectrum \(X[k]\), the **spectral power** in a band of interest is obtained as \(P*\text{band} = \sum*{k \in \mathcal{B}} |X[k]|^2 / N\). For the IR flame sensor channel, energy concentrated in the 10–15 Hz band is a strong positive indicator of a genuine flame, because static heat sources (e.g., cooking hotplates) and direct sunlight do not produce periodic oscillations in this band. Fonollosa et al. (2018) emphasised that dynamic, frequency-domain features are imperative for multivariate fire models because they encode temporal modulation patterns that static magnitude thresholds cannot capture.

Beyond band energy, additional spectral descriptors extracted from the FFT magnitude spectrum improve discriminability:

- **Spectral centroid**: the power-weighted mean frequency, which shifts toward lower values for slow gas-diffusion events and toward the flicker band for flame events.
- **Spectral entropy**: a measure of how uniformly energy is distributed across the spectrum; genuine flame signals have lower entropy (energy concentrated at flicker harmonics) than broadband noise from cooking or HVAC disturbances.
- **Peak frequency**: the bin index \(k^\* = \arg\max_k |X[k]|^2\), providing a direct test of whether the dominant oscillation falls inside the 10–15 Hz flicker window.

Wu et al. (2021) demonstrated that multi-sensor fire detection systems benefit from trend- and frequency-based feature extraction, showing that temporal pattern features derived from gas sensor signals improved BiLSTM model accuracy by reducing confusion with non-fire thermal events. While that study operated in the time domain using Kendall's tau trend scores rather than FFT, the underlying principle is equivalent: both methods exploit the characteristic _temporal dynamics_ of fire-related signals, rather than their instantaneous amplitude alone. For an embedded system constrained by the 256 KB Flash of the RA4M1, a fixed-length FFT window (e.g., 128 points at 10 Hz yields a 12.8-second analysis frame) is computationally feasible using the CMSIS-DSP fixed-point FFT library, which executes a 128-point FFT in fewer than 0.5 ms on a Cortex-M4.

---

## 3.4.3 Cross-Sensor Correlations and Dimensionality Reduction

Whereas the preceding two subsections treat each sensor channel independently, the strongest discriminative signal in a multi-modal system often resides in the _relationships_ between channels. During genuine combustion, CO, VOC, temperature, and IR intensity co-vary in a physically constrained manner: CO and VOC concentrations both rise because they share the same combustion source, temperature increases as a consequence of heat release, and IR intensity fluctuates at the flicker frequency. False-alarm scenarios disrupt these co-variation patterns—for instance, cooking fumes elevate VOC without producing sustained CO rises or IR modulation in the flicker band, while intense static IR sources (e.g., incandescent lights) increase the IR reading without any accompanying gas response. Exploiting these cross-sensor dependencies is therefore essential for three-class discrimination.

**Pearson's cross-correlation coefficient** between channels \(a\) and \(b\) within a window:

\[\rho*{ab} = \frac{\sum*{i=1}^{N}(a*i - \bar{a})(b_i - \bar{b})}{\sqrt{\sum*{i=1}^{N}(a*i-\bar{a})^2 \cdot \sum*{i=1}^{N}(b_i-\bar{b})^2}}\]

provides a windowed coupling measure that is physically interpretable and computationally inexpensive. The CO–temperature, CO–VOC, and IR–temperature pairs are the most diagnostically informative for this application, as argued in Fonollosa et al. (2018): the review concluded that "the use of dynamic features and multivariate models that exploit sensor correlations seems imperative" for robust gas-based fire detection.

However, computing all pairwise correlations across five sensor channels yields \(\binom{5}{2} = 10\) coefficients, which, combined with the time- and frequency-domain features, produces a high-dimensional feature vector. High dimensionality increases training data requirements, risks overfitting on the limited dataset collected for this project, and inflates inference latency on the microcontroller. **Principal Component Analysis (PCA)** addresses this by projecting the feature matrix onto its eigenvectors of maximum variance, retaining only the \(n\) components needed to explain a target fraction (e.g., 95%) of total variance while discarding redundant or noisy dimensions. Zakaria et al. (2016) demonstrated this benefit directly in an incipient fire detection study: applying PCA to a multi-sensor gas array reduced the feature set from eight dimensions to five–seven principal components without information loss, and the resulting PCA–PNN classifier achieved a classification accuracy of 98.25%–100% across two independent datasets, outperforming all non-reduced baselines. The authors attributed the accuracy gain to PCA's removal of inter-sensor redundancy and sensor drift artefacts, both of which are also concerns in the present MEMS-based hardware.

An alternative supervised dimensionality reduction method is **Linear Discriminant Analysis (LDA)**, which seeks projections that maximise between-class scatter relative to within-class scatter, and is therefore better suited when labelled training data are available and class separability is the primary objective. Vorwerk et al. (2024) applied LDA to multi-sensor fire detection features (CO, H₂, VOC, and PM) for transfer across experimental environments, achieving a classification rate of up to 69% without any target-domain data and 87% after boosting with 5% of target-domain instances. Their findings corroborate that supervised dimensionality reduction—whether LDA or PCA—is essential for generalising learned multi-sensor fire signatures across environments, a challenge directly relevant when deploying the present system in varied indoor settings.

In the context of this project, PCA will be applied post-feature-extraction (after time-domain statistics and spectral descriptors have been concatenated) to reduce the combined feature vector to a fixed-length input for the Edge Impulse neural network classifier. The number of retained components will be determined empirically by a scree-plot analysis on the training dataset, following the Kaiser criterion (\(\lambda > 1\)) as a practical lower bound.

---

## References

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. _Sensors_, _18_(2), Article 553. https://doi.org/10.3390/s18020553

Kim, G.-L., Ro, S.-J., & Lee, K. (2024). A multi-sensor fire detection method based on trend predictive BiLSTM networks. _Journal of Sensor Science and Technology_, _33_(5), 248–254. https://doi.org/10.46670/JSST.2024.33.5.248

Vorwerk, P., Kelleter, J., Müller, S., & Krause, U. (2024). Classification in early fire detection using multi-sensor nodes—A transfer learning approach. _Sensors_, _24_(5), Article 1428. https://doi.org/10.3390/s24051428

Zakaria, A., Shakaff, A. Y. M., Saad, S. M., & Adom, A. H. (2016). Multi-stage feature selection based intelligent classifier for classification of incipient stage fire in building. _Sensors_, _16_(1), Article 31. https://doi.org/10.3390/s16010031

Wu, L., Chen, L., & Hao, X. (2021). Multi-sensor data fusion algorithm for indoor fire early warning based on BP neural network. _Information_, _12_(2), Article 59. https://doi.org/10.3390/info12020059

---

## Glossary

- **FFT (Fast Fourier Transform)**: An efficient algorithm for computing the Discrete Fourier Transform of a finite-length signal, decomposing it into constituent frequency components.
- **Spectral power**: The squared magnitude of a signal's Fourier coefficients within a specified frequency band, representing energy concentration at those frequencies.
- **Kurtosis**: A fourth-order statistical moment measuring the heaviness of a distribution's tails; high kurtosis indicates impulsive, spike-like signal behaviour.
- **RMS (Root Mean Square)**: The square root of the mean of squared sample values, providing a measure of signal energy or effective amplitude over a window.
- **PCA (Principal Component Analysis)**: An unsupervised linear transformation that projects data onto orthogonal axes of maximum variance, reducing dimensionality while retaining most information.
- **LDA (Linear Discriminant Analysis)**: A supervised dimensionality reduction method that finds projections maximising the ratio of between-class to within-class variance.
- **Flame flicker frequency**: The characteristic oscillation frequency (approximately 1–15 Hz) of turbulent diffusion flames, caused by periodic vortex shedding at the flame base.
