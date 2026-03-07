== Class-Specific Data Collection Scenarios

To develop a robust multi-sensor fire detection system capable of distinguishing between actual fire events, normal ambient conditions, and common false alarms, a meticulously planned data collection methodology was employed. This approach focused on generating a comprehensive dataset encompassing three distinct classes: "Fire," "No-Fire," and "False Alarm." Each class was characterized by specific environmental scenarios designed to capture a wide range of relevant sensor signatures.

#figure(
  table(
    columns: (1fr, 0.5fr, 1.5fr, 2fr),
    inset: 10pt,
    align: horizon,
    [*Class*], [*ID*], [*Scenario Name*], [*Primary Physical Signature*],
    [*Fire*], [A1], [Close Range Flame], [High Flame (>800), Rising Smoke/CO],
    [*Fire*], [A3], [Smoldering Material], [High Smoke/VOC, Low Flame IR],
    [*No-Fire*], [B1], [Ambient Office], [Stable Baseline (Low readings across all)],
    [*False Alarm*], [C1], [Cooking Fumes], [High VOC/Smoke, Negligible CO],
    [*False Alarm*], [C2], [Steam / Humidity], [High Humidity (>80%), Stable CO/VOC],
    [*False Alarm*], [C3], [Alcohol Sprays], [Extreme VOC Spikes, Stable Flame/CO],
  ),
  caption: [Catalog of Data Collection Scenarios and Physical Signatures],
) <table-scenario-catalog>

The data collection adhered to strict protocols to ensure consistency, reproducibility, and safety, utilizing the automated data collection scripts (`the automated data collection utility`) for standardized sampling.

=== Fire Class: Paper, Wood, Cloth Burns

The "Fire" class aimed to capture the multi-sensor signatures of genuine combustion events under varying conditions. This involved controlled burns of common household materials to simulate realistic fire scenarios. The goal was to generate data where flame, smoke, CO, VOC, and temperature/humidity sensors would exhibit characteristic responses indicative of active fire.

- *Scenario A1: Close Range & Low Ventilation*: This scenario simulated an early-stage fire in a confined space. A small flame source (e.g., candle or gas burner) was positioned 10-15 cm directly in front of the sensor array in a closed environment. Data collection commenced after 30 seconds of flame stabilization. Verification involved checking `flame` values (700-900) and rising `smoke` (the project data collection guide, n.d.).
- *Scenario A2: Medium Range & Normal Ventilation*: This scenario represented a more developed fire with typical airflow. The flame source was placed 30-50 cm from the sensors in an open-ventilated space. `flame` values were expected to be moderate (400-700), reflecting the increased distance and dispersion (the project data collection guide, n.d.).

#figure(
  grid(
    columns: 2,
    gutter: 10pt,
    image("../../../../assets/figures/data-collection-evidence/002-flame-source-only-indoors.jpg", width: 100%),
    image("../../../../assets/figures/data-collection-evidence/003-flame-smoke-indoors.jpg", width: 100%),
  ),
  caption: [Indoor Fire Data Collection. Left: capturing infrared signatures from a flame source; Right: capturing combined flame and smoke signatures.],
) <fig-fire-collection-indoor>

- *Scenario A3: Smoldering*: To capture the signatures of slow, smoldering fires, materials like incense sticks or extinguished matches were used. These events primarily generate smoke and VOCs without an open flame, posing a distinct detection challenge for IR-based sensors (the project data collection guide, n.d.).

#figure(
  image("../../../../assets/figures/data-collection-evidence/005-smoke-only-indoors.jpg", width: 80%),
  caption: [Smoldering Fire Simulation. The sensor node capturing particulate and VOC signatures from a smoldering source without visible flame.],
) <fig-smoldering-collection>

Each fire scenario was conducted to capture multi-sensor data at a sampling rate of 10 Hz over a specific duration, ensuring a rich temporal dataset for model training. The raw data for the "Fire" class is organized under `the fire dataset directory`.

=== No-Fire Class: Idle Office, Kitchen Ambient

The "No-Fire" class aimed to establish a robust baseline of normal environmental conditions. This data is critical for training the model to recognize the absence of fire and differentiate it from both true fire events and false alarms. The scenarios focused on common indoor environments without any fire hazards or nuisance sources.

- *Scenario B1: Baseline Room Air (Generic)*: This involved collecting data in a typical office or living room environment with no specific disturbances, establishing a general ambient baseline. Sensor readings were expected to be stable and low (the project data collection guide, n.d.).
- *Scenario B2: Baseline Room Air (Closed Room)*: Data was collected in a sealed room (windows and doors closed) to observe sensor behavior in reduced airflow conditions. Readings were expected to remain stable and low (the project data collection guide, n.d.).
- *Scenario B3: Baseline Room Air (Open Space)*: This scenario captured data in a well-ventilated area with open windows and doors, simulating environments with significant airflow. Sensor readings were verified to be stable and low (the project data collection guide, n.d.).
- *Scenario B4: HVAC/Temp Transients*: To account for environmental fluctuations, data was collected during rapid temperature changes induced by HVAC systems or opening windows. Verification involved checking `temp` or `humid` columns for trends (the project data collection guide, n.d.).

These scenarios provided a comprehensive representation of non-fire conditions, allowing the model to learn the expected variations in sensor readings in a stable, non-alarming environment. The raw data for the "No-Fire" class is stored in `the ambient environment dataset directory`.

=== False-Alarm Class: Cooking Fumes, Alcohol Vapors, Intense IR Light

The "False Alarm" class is specifically designed to address the project's key innovation: distinguishing common nuisance events from actual fires. These scenarios mimic typical false alarm triggers that often plague traditional fire detection systems, aiming to capture their unique multi-sensor fingerprints.

- *Scenario C1: Cooking Fumes*: Data was collected while cooking (e.g., frying) near the sensors, ensuring safe placement. This scenario is expected to produce elevated `voc` and `smoke` readings, but crucially, `co` levels should remain low. This signature helps differentiate cooking from genuine combustion (the project data collection guide, n.d.).

#figure(
  image("../../../../assets/figures/data-collection-evidence/006-cooking-using-pan-indoors.jpg", width: 65%),
  caption: [Cooking Fume False Alarm Scenario. The sensor node capturing signatures from a frying pan, documenting the high VOC/Smoke but low CO profile.],
) <fig-cooking-false-alarm>

The project's `the system documentation` highlights that false alarms (steam/cooking) often show higher temperature spikes than early-stage fires, making sensor fusion vital over simple heat detection.
- *Scenario C2: Steam*: Data was captured as steam (e.g., from a boiling kettle or hot shower) drifted towards the sensors. Expected sensor responses include significant `humid` spikes (70-85%), with `co` and `voc` remaining low (the project data collection guide, n.d.).

#figure(
  grid(
    columns: 2,
    gutter: 10pt,
    image("../../../../assets/figures/data-collection-evidence/007-boiling-water-indoors-pt1.jpg", width: 100%),
    image("../../../../assets/figures/data-collection-evidence/008-boiling-water-indoors-pt2.jpg", width: 100%),
  ),
  caption: [Steam and Humidity False Alarm Capture. The sensor node capturing high humidity spikes from boiling water in both direct and ambient kitchen settings.],
) <fig-steam-false-alarm>
- *Scenario C3: Sprays (Alcohol/Cleaner)*: Aerosol sprays, such as air fresheners or cleaners, were deployed at a safe distance from the sensors. This generates huge `voc` spikes, while `temp` and `co` should remain stable, providing a distinct false alarm signature (the project data collection guide, n.d.). The `the system documentation` further notes that spray/steam scenarios exhibit high VOC/Smoke but negligible CO spikes, solidifying CO as a "truth sensor."

These class-specific scenarios ensure the dataset contains rich, labeled examples for each of the three target classes, enabling the TinyML model to learn nuanced distinctions and thereby significantly reduce false positives. The raw data for the "False Alarm" class resides in `the false alarm dataset directory`.
