== Multi-Modal Sensing Principles <sec:multimodal_sensing>

The efficacy of the _Autonomous Sensing Node_ is predicated on its ability to monitor diverse physical and chemical phenomena associated with combustion. Unlike legacy systems that rely on a single modality, multi-modal sensing leverages the cross-correlation between different environmental markers to reduce ambiguity. This section examines the theoretical principles of MEMS-based gas sensing and infrared (IR) flame detection, providing the scientific rationale for the sensor fusion architecture employed in this research.

=== Principles of MEMS Gas Sensing

Modern gas sensing for fire detection utilizes Micro-Electro-Mechanical Systems (MEMS) technology, which allows for the integration of heating elements and sensing layers on a sub-millimeter scale. The sensors used in this project—specifically for Carbon Monoxide (CO) and Volatile Organic Compounds (VOC)—operate on the chemiresistive principle. These sensors typically employ a metal-oxide semiconductor (MOS) sensing layer (e.g., $S n O_2$) deposited on a heated substrate. When the layer is heated to its operating temperature ($200 deg C - 400 deg C$), oxygen molecules from the air are adsorbed onto the surface, forming an electron-depletion layer that increases the sensor's electrical resistance.

Upon exposure to reducing gases such as CO or VOCs, these molecules react with the adsorbed oxygen, releasing electrons back into the conduction band and causing a measurable decrease in resistance @fonollosa2018chemical. The selectivity of these sensors is enhanced through the use of specific catalysts and precise temperature control. Carbon Monoxide is a particularly critical "truth sensor" because it is a direct byproduct of incomplete combustion, whereas many household aerosols (like cooking steam) produce high smoke or VOC readings but negligible CO spikes @Milli2025Reducing.

=== Infrared Flame Detection Mechanisms

Flame detection relies on the observation of the electromagnetic radiation emitted by the high-temperature chemical reactions within a fire. The primary marker for hydrocarbon-based fires is the emission spectrum of carbon dioxide ($C O_2$), which exhibits a characteristic peak in the mid-infrared range at approximately $4.3 \mu m$. However, for low-cost edge nodes, near-infrared (NIR) sensors—such as the one utilized in this project—monitor the $760 n m$ to $1100 n m$ range.

These sensors utilize the photoelectric effect, where incident IR photons generate a current in a semiconductor junction. The theoretical challenge in IR detection is the presence of environmental noise, such as solar radiation or incandescent lighting, which can mimic the steady-state IR signature of a flame. Advanced nodes mitigate this through temporal analysis of the signal's "flicker" frequency (typically $1 H z - 30 H z$), which is a characteristic physical property of uncontrolled diffusion flames @toreyin2012wavelet.

=== Theoretical Framework for Sensor Fusion

The integration of these diverse modalities into a single decision-making framework is supported by the theory of data fusion. By combining complementary data (e.g., gas concentrations) and redundant data (e.g., smoke and IR), the system can navigate the "Heat Paradox"—the observation that false alarm sources often exhibit higher thermal signatures than early-stage fires @solorzano2021early. In a multi-modal architecture, the presence of smoke without a corresponding spike in CO or a characteristic IR flicker can be statistically categorized as a _false_alarm_ with high confidence. This "Physical Fingerprinting" approach ensures that the _Autonomous Sensing Node_ remains resilient against environmental interference while maintaining high sensitivity to genuine combustion events @muller2024classification.

=== Section Glossary

- **Chemiresistive Sensing**: A sensing mechanism where the electrical resistance of a material changes in response to the chemical adsorption of gas molecules.
- **Metal-Oxide Semiconductor (MOS)**: A class of materials commonly used in gas sensors due to their high sensitivity to redox reactions at their surface.
- **Incomplete Combustion**: A chemical reaction where a fuel is only partially oxidized, resulting in the production of Carbon Monoxide (CO) and soot rather than Carbon Dioxide ($C O_2$).
- **Photoelectric Effect**: The physical phenomenon where light (photons) incident on a material causes the emission of electrons or the generation of an electrical current.
- **Physical Fingerprinting**: The technique of identifying a specific phenomenon (like fire) by observing the unique combination of multiple physical and chemical markers.
