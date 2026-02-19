# 3.2 Characteristics of MEMS Smoke, VOC, CO, IR Flame, and Temperature/Humidity Sensors

The selection and characterisation of individual sensors within a multi-modal fire detection node requires a thorough understanding of each transducer's operating principle, sensitivity range, cross-sensitivity behaviour, and constraints under realistic deployment conditions. The five sensor modalities employed in this system — MEMS smoke, MEMS VOC, MEMS CO, IR flame, and temperature/humidity — each respond to a distinct physical or chemical correlate of combustion and together constitute an overlapping, complementary sensing envelope. This section characterises each modality, with particular attention to the properties that drive both classification capability and potential vulnerability to false-alarm stimuli.

---

## 3.2.1 MEMS Smoke Detection Sensor

Smoke sensors of the metal oxide semiconductor (MOS) type detect airborne combustion particulates and pyrolysis gases through the principle of surface-resistance modulation. When target gas molecules — most commonly reducing gases such as ethanol, methane, and carbon monoxide that co-occur with smoke plumes — adsorb onto the heated SnO₂ sensing layer, they react with pre-adsorbed oxygen ions, releasing electrons back into the conduction band and thereby reducing the bulk resistance of the oxide (Khan et al., 2022). The MEMS fabrication of the heater and sensing element on a single silicon die reduces thermal mass and power consumption relative to traditional ceramic-substrate designs, achieving operating temperatures in the range of 200–400 °C within a low-profile surface-mount package.

A critical characteristic of MOS smoke sensors in the context of fire discrimination is their inherently broad cross-sensitivity. Because resistance modulation is driven by the redox chemistry of any reducing gas, cooking fumes, alcohol vapours, and cleaning aerosols — all common household false-alarm sources — elicit responses quantitatively similar to those from genuine combustion smoke (Khan et al., 2022). Sensitivity is typically expressed as the ratio R_air/R_gas, where R_air is baseline resistance in clean air and R_gas is resistance under target-gas exposure; for SnO₂-based devices this ratio can span one to two orders of magnitude across the full detection range (10–1000 ppm equivalent ethanol concentration for commercially available MEMS variants). Warm-up and stabilisation time must be accounted for in firmware design: MOS sensors commonly require a 30–60 second thermal stabilisation period after power-on before readings are reliable.

---

## 3.2.2 MEMS VOC Gas Sensor

Volatile organic compounds (VOCs) are released during the thermal degradation and early smouldering phase of most organic combustibles — well before visible flaming ignition occurs. MEMS VOC sensors exploit the same MOS resistance-modulation mechanism as smoke sensors but are typically optimised with different dopants (e.g., Pd or Pt catalytic overlayers on SnO₂ or WO₃ substrates) to shift peak sensitivity toward aromatic and aldehyde species such as benzene, toluene, and acetaldehyde that are characteristic of pyrolysis (Khan et al., 2022). This selectivity makes VOC sensors particularly valuable for detecting smouldering fires, which produce relatively little smoke aerosol but emit significant quantities of oxygenated organic compounds.

The principal limitation of MEMS VOC sensors in building environments is the ubiquity of non-fire VOC sources. Freshly applied paints, adhesives, cleaning products, and personal care products all off-gas VOCs at concentrations that can saturate the sensor's useful dynamic range (Deng et al., 2023). For this reason, VOC readings must be interpreted within a multi-sensor context: an elevated VOC response that co-occurs with increased CO and temperature provides strong evidence for combustion, whereas an isolated VOC response in the absence of other fire signatures is the defining fingerprint of the false-alarm class. Response time for MEMS VOC sensors is typically on the order of seconds, with recovery times that depend strongly on ambient ventilation — a factor that influences feature engineering choices at the data-preparation stage.

---

## 3.2.3 MEMS Carbon Monoxide Sensor

Carbon monoxide is a product of incomplete combustion and is generated in significant concentrations during both smouldering and early flaming stages of virtually all organic fuel fires (Khan et al., 2022). Unlike smoke or VOC sensors, MEMS CO sensors based on electrochemical or MOS principles exhibit considerably narrower cross-sensitivity profiles: common false-alarm sources such as cooking steam, cleaning sprays, or IR illumination do not produce CO at detectable concentrations. This selectivity makes CO the most reliable single-sensor combustion indicator in the array, a property confirmed empirically in multi-sensor fire detection studies where CO concentration was the variable most strongly correlated with confirmed fire events (Deng et al., 2023).

MOS-based CO sensors operate on the same resistance-modulation principle described for smoke and VOC sensors, with SnO₂ or In₂O₃ active layers optimised to respond to CO partial pressures in the range of 1–1000 ppm. A key operational consideration is the influence of humidity on baseline resistance: elevated humidity can either suppress or enhance CO sensitivity depending on the oxide formulation, introducing a systematic measurement uncertainty that underscores the need for co-located temperature/humidity sensing (Khan et al., 2022). Sensor drift over months of operation is a recognised limitation of MOS CO sensors, necessitating periodic recalibration or drift-compensation strategies in production deployments.

---

## 3.2.4 IR Flame Sensor (760 nm–1100 nm)

Flame sensors exploiting the near-infrared (NIR) spectral region detect the characteristic radiant emission of hot combustion gases and incandescent particulates. Hydrocarbon flames emit strongly in the 760–1100 nm band due to near-infrared continuum radiation from soot particles and the overtone emission bands of H₂O and CO₂ produced in the reaction zone (Khan et al., 2022). A photodiode or phototransistor with a bandpass-filtered response in this window provides a direct, physics-based indicator of flaming combustion, with sub-second response latency — substantially faster than gas-diffusion-dependent chemical sensors.

The primary false-alarm vulnerability of NIR flame sensors is exposure to intense broadband radiation sources: incandescent lamps, halogen heaters, direct sunlight, and some LED fixtures all emit appreciably in the 760–1100 nm band. This cross-sensitivity to non-fire radiation sources is a well-documented source of spurious alarms in single-sensor deployments (Khan et al., 2022). Importantly, genuine flames exhibit a characteristic temporal flickering pattern at 10–15 Hz due to turbulent combustion dynamics; analysing the spectral power of the flame sensor signal in this frequency band provides a discriminative feature that is absent from steady artificial radiation sources. The exploitation of this flicker signature through spectral feature extraction is discussed in Section 3.4.

---

## 3.2.5 AHT20 Temperature and Humidity Sensor

The AHT20 is a calibrated digital sensor integrating both a band-gap temperature element and a capacitive polymer humidity sensing cell within a single MEMS package, communicating via I²C. Temperature measurement accuracy is specified at ±0.3 °C over the range of –40 to +85 °C, and relative humidity accuracy at ±2% RH over 0–100% RH, with a sampling rate suitable for 10 Hz data acquisition. In the context of fire detection, ambient temperature rise is a reliable secondary indicator of combustion: sustained heating elevates local air temperature measurably above the seasonal baseline, contributing a thermal channel to the sensor fusion model (Deng et al., 2023).

However, temperature alone is an insufficient fire discriminant in indoor environments where cooking appliances, space heaters, and hot beverages routinely produce temperature elevations comparable in magnitude to early-stage fire plumes. The humidity channel provides a complementary discriminant: real fires produce a transient humidity decrease through convective displacement of moisture, whereas cooking fumes and steam cleaning — prime false-alarm scenarios — produce a marked humidity _increase_ (Deng et al., 2023). The joint use of both temperature and humidity readings therefore enables the classifier to resolve ambiguities that would arise from temperature monitoring alone, and the AHT20's dual-output architecture is specifically suited to this discriminative role within the sensor fusion pipeline.

---

## References

Khan, F., Xu, Z., Sun, J., Khan, F. M., Ahmed, A., & Zhao, Y. (2022). Recent advances in sensors for fire detection. _Sensors_, _22_(9), 3310. https://doi.org/10.3390/s22093310

Deng, X., Shi, X., Wang, H., Wang, Q., Bao, J., & Chen, Z. (2023). An indoor fire detection method based on multi-sensor fusion and a lightweight convolutional neural network. _Sensors_, _23_(24), 9689. https://doi.org/10.3390/s23249689

---

## Glossary

- **MOS (Metal Oxide Semiconductor):** A class of gas sensor in which the electrical resistance of a heated metal oxide film changes in response to adsorption of target gas molecules.
- **Cross-sensitivity:** The response of a sensor to a chemical or physical stimulus other than its primary target analyte, which can produce false readings.
- **Pyrolysis:** Thermal decomposition of organic material in the absence of sufficient oxygen, producing VOCs and CO characteristic of smouldering fire.
- **NIR (Near-Infrared):** The spectral region from approximately 700 nm to 2500 nm, within which flame sensors and soot/gas emission bands relevant to fire detection are located.
- **Flicker frequency:** The characteristic 10–15 Hz oscillation of flame luminosity caused by turbulent combustion dynamics, exploitable as a discriminative spectral feature.
- **I²C:** Inter-Integrated Circuit; a two-wire serial communication protocol used to interface digital sensors (including the AHT20) with microcontrollers.
