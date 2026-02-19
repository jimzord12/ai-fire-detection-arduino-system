# 3.1 Physics and Operating Principles of Fire-Relevant Sensors

The detection performance of any intelligent fire node is fundamentally bounded by the physical transduction mechanisms of its constituent sensors. Understanding these mechanisms — including sensitivities, selectivities, cross-sensitivities, and degradation pathways — is a prerequisite for designing a reliable sensor fusion architecture. Fonollosa et al. (2018) identify multivariate sensor data processing as essential precisely because chemical sensors respond to a broad variety of volatiles beyond pure combustion products, rendering single-sensor, threshold-based detection inherently unreliable. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

---

## 3.1.1 MEMS MOx Gas Sensors

### The Chemiresistive Mechanism

Metal Oxide Semiconductor (MOx) gas sensors — used here for smoke, VOC, and CO analytes — operate on the **chemiresistive effect**: the bulk electrical resistance of a polycrystalline semiconducting oxide film changes reversibly upon the adsorption and surface reaction of gas-phase species at the heated sensor surface (Fonollosa et al., 2018). The canonical material, SnO₂ (tin dioxide), is an n-type semiconductor with a wide bandgap (~3.6 eV) and a high surface density of oxygen vacancies that act as reactive adsorption sites. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

In ambient air, oxygen molecules chemisorb onto SnO₂ grain boundaries and capture conduction-band electrons, forming negatively charged surface species. This electron depletion creates a Schottky-type potential barrier at inter-grain contacts, raising bulk resistance. Upon introduction of a **reducing gas** — such as CO or a fire-relevant VOC such as acrolein or formaldehyde, which Fonollosa et al. (2018) identify as primary pyrolysis markers — the following surface reaction occurs: [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

\[CO*{(g)} + O^-*{(ads)} \rightarrow CO\_{2(g)} + e^-\]

Electrons are re-injected into the conduction band, collapsing the inter-grain barrier and **decreasing** sensor resistance. Standard sensitivity is defined as:

\[S = \frac{R*{air}}{R*{gas}}\]

For **oxidizing gases** (e.g., NO₂), the inverse mechanism applies — additional electron trapping further raises resistance. Fonollosa et al. (2018) note that different fire scenarios produce chemically distinct volatile profiles: flaming combustion is dominated by CO and light VOCs, while smouldering fires emit heavier organic compounds — meaning MOx selectivity is fundamentally scenario-dependent and cross-sensitivity between analytes is unavoidable. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

### Temperature Dependence of Sensitivity and Selectivity

The catalytic activity of the MOx surface is strongly governed by operating temperature. Fonollosa et al. (2018) highlight that MOx sensors are typically operated at internal heater temperatures between 200 °C and 500 °C, where two competing processes determine net sensitivity: gas adsorption kinetics (favoured at lower temperatures) and surface reaction rates (favoured at higher temperatures). The result is a characteristic bell-shaped sensitivity curve with a peak at an analyte-specific optimal temperature — this is the principal mechanism by which **temperature modulation achieves selectivity** in an otherwise non-selective sensor. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

Dynamic temperature cycling — rapid modulation of heater power — generates a rich temporal resistance signature unique to each analyte, effectively encoding chemical identity into a transient waveform (Fonollosa et al., 2018). In MEMS implementations, the extremely low thermal mass of the suspended microhotplate (on the order of micrograms) enables cycling frequencies in the range of milliseconds to seconds, yielding high-density temporal feature vectors directly suitable for machine learning classifiers. Wang et al. (2025) further emphasise that multi-sensor fusion is essential because no single MOx channel provides sufficient specificity to discriminate fire events from domestic interference sources such as cooking fumes, cleaning aerosols, and steam — a core motivation for the three-class architecture (fire / no_fire / false_alarm) of this project. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

---

## 3.1.2 IR Flame Detection

### The 4.3 µm CO₂ Emission Band

All hydrocarbon flames emit infrared radiation characterised by the strong CO₂ asymmetric-stretching emission band centred at approximately **4.3 µm** — a wavelength region absent in the blackbody emission of non-combustion hot surfaces such as incandescent lamps or solar radiation (Wang et al., 2025). This spectral selectivity arises because although atmospheric CO₂ absorbs much of the ambient 4.3 µm background, the concentrated CO₂ column within and immediately above a flame generates a locally intense emission signal that substantially exceeds the ambient level. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

Zhang & Sun (2024) note that IR-based detection systems exploit this by pairing a 4.3 µm bandpass-filtered photodetector with a reference channel (typically at 4.0 µm or broadband) in a ratiometric scheme that rejects common-mode thermal background, dramatically reducing false alarms from industrial heaters or direct sunlight. Silicon-based pyroelectric and thermopile IR transducers respond to the **rate of change** of incident radiative flux rather than its absolute value — a fundamental physical property that enables intrinsic discrimination of a **dynamic** flame from a **static** heat source, since a steady thermal emitter produces zero AC output. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

### Flame Flicker: 1–30 Hz Temporal Signature

Turbulent combustion generates characteristic luminosity fluctuations in the **1–30 Hz** range — the flame flicker frequency — caused by buoyancy-driven vortex shedding at the flame base and fuel-oxidant mixing instabilities (Wang et al., 2025). A steady thermal source (e.g., a hot plate or halogen lamp) cannot replicate this modulation; time-domain frequency analysis of the IR detector output is therefore a powerful fire discriminant. Su et al. (2022) confirm that multi-sensor architectures combining the IR temporal signature with chemical sensor data substantially reduce false positives, since no single non-combustion source can simultaneously replicate the chemical and optical fire signature. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

---

## 3.1.3 AHT20 — Capacitive Humidity and Thermal Sensing

### Capacitive Humidity Transduction Physics

The AHT20 employs a **capacitive polymer humidity element**: a hygroscopic dielectric polymer film is deposited between two planar electrodes, forming a capacitor whose dielectric permittivity increases as water vapour is absorbed from the surrounding air. The relationship between capacitance and relative humidity (RH) arises because water molecules (dipole moment ~1.85 D) elevate the effective dielectric constant of the dry polymer matrix (ε ≈ 2–3) toward the bulk permittivity of liquid water (ε ≈ 80), yielding a monotonically increasing C–RH characteristic:

\[\Delta C \propto \epsilon\_{eff}(RH) \cdot \frac{A}{d}\]

where \(A\) is the electrode area and \(d\) is the dielectric film thickness. An integrated NTC thermistor enables simultaneous temperature measurement, permitting on-chip correction of the temperature-dependence of the C–RH curve via the Clausius-Clapeyron relation. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

### Role in Combustion Event Detection

Su et al. (2022) include temperature and humidity as first-class sensing modalities in their multi-sensor indoor fire perception framework specifically because combustion events produce a rapid, co-occurring coupled signature: a steep **temperature rise** alongside a transient **humidity change** — an initial increase from water vapour produced during early-stage combustion, followed by a decline as ambient moisture is driven off by radiant and convective heat. Wang et al. (2025) note that these coupled temperature–humidity transients are highly characteristic of fire scenarios and are difficult to replicate by isolated false-alarm sources: cooking steam produces humidity rise without significant CO increase; a space heater produces a temperature rise without meaningful humidity change. This cross-modal orthogonality between the AHT20 channels and the MOx gas channels is a key structural property exploited in the sensor fusion classification stage. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

---

## 3.1.4 Sensor Aging, Drift, and Compensation

### Long-Term Stability of MEMS Gas Sensors

MEMS MOx sensors are subject to well-documented **long-term drift** arising from three principal mechanisms reviewed by Fonollosa et al. (2018): [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

- **Microstructural coarsening**: Grain growth in the polycrystalline oxide film at elevated operating temperature progressively reduces active surface area and sensitivity magnitude
- **Surface poisoning**: Adsorption of high-boiling contaminants (silicones, sulphur compounds, heavy VOCs) permanently occupies active sites, producing an irreversible baseline shift
- **Stoichiometric drift**: Slow changes in grain-boundary oxygen vacancy density alter the baseline resistance \(R\_{air}\) even in clean air

These effects manifest as a gradual increase or decrease in the zero-gas baseline resistance and a reduction in the sensitivity ratio \(S = R*{air}/R*{gas}\) — both of which corrupt fixed-threshold detectors if left uncompensated (Fonollosa et al., 2018). [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

### Compensation Techniques

Fonollosa et al. (2018) review several algorithmic strategies for managing sensor drift in fire-detection chemical sensor arrays: [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5855033/)

- **Adaptive baseline correction**: The stored \(R*{air}(t)\) reference is continuously updated via an exponential moving average, so that \(S(t) = [R*{air}(t) - R*{gas}(t)] / R*{air}(t)\) tracks the drifting baseline in real time
- **Subspace projection (PCA/CC)**: Multi-sensor response vectors are projected onto drift-orthogonal subspaces identified from calibration data, separating slowly varying drift variance from fast analyte-driven variance
- **Periodic recalibration**: Scheduled exposure to a known reference gas mixture re-anchors the feature space to a consistent calibration point
- **Ensemble redundancy**: Neural network architectures trained on multi-sensor input vectors demonstrate inherent robustness to single-channel drift, as the network learns compensatory cross-channel weighting (Zhang & Sun, 2024; Wang et al., 2023) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

Su et al. (2022) further demonstrate that temporal sequence models — their TCN-SVM architecture processes windows of multi-sensor time-series data — can exploit the **temporal structure** of drift events, which evolve slowly over days to weeks, to distinguish them from the abrupt, multi-channel co-activation signature of a genuine fire event, substantially improving system resilience to sensor ageing. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/105753800/a05d0c23-1a15-49b0-93b6-41d46d736b4c/literature.md)

---

## Reference List

Fonollosa, J., Solórzano, A., & Marco, S. (2018). Chemical sensor systems and associated algorithms for fire detection: A review. _Sensors_, _18_(2), 553. https://doi.org/10.3390/s18020603

Su, J., Cheng, J., & Wang, S. (2022). Research on multi-sensor fusion indoor fire perception algorithm based on TCN-SVM. _Sensors_, _22_(12), 4443. https://doi.org/10.3390/s22124443

Wang, W., Wang, X., & Zhao, J. (2025). Enhanced sensor fusion and adaptive control for fire detection. Engineering Science and Technology, an International Journal. Advance online publication.
https://www.sciencedirect.com/science/article/pii/S2090447925003545

Wang, Y., Zhang, L., & Zheng, X. (2023). Hybrid feature fusion-based high-sensitivity fire detection and warning method. _Sensors_, _23_(2), 784. https://doi.org/10.3390/s23020784

Zhang, Q., & Sun, J. (2024). A multi-sensor fusion approach for IoT-based firefighting systems using neural networks. _Journal of Physics: Conference Series_, _1544_(1), 012115. https://doi.org/10.1088/1742-6596/1544/1/012115
