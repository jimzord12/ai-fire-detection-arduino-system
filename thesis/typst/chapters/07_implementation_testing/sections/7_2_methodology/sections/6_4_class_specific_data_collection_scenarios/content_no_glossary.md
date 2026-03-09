# Class-Specific Data Collection Scenarios

To develop a robust multi-sensor fire detection system capable of distinguishing between actual fire events, normal ambient conditions, and common false alarms, a meticulously planned data collection methodology was employed. This approach focused on generating a comprehensive dataset encompassing three distinct classes: "Fire," "No-Fire," and "False Alarm." Each class was characterized by specific environmental scenarios designed to capture a wide range of relevant sensor signatures. The data collection adhered to strict protocols to ensure consistency, reproducibility, and safety, utilizing the automated data collection scripts (`tools/collection/automated_data_collection.sh`) for standardized sampling.

## 6.4.1 Fire Class: Paper, Wood, Cloth Burns

The "Fire" class aimed to capture the multi-sensor signatures of genuine combustion events under varying conditions. This involved controlled burns of common household materials to simulate realistic fire scenarios. The goal was to generate data where flame, smoke, CO, VOC, and temperature/humidity sensors would exhibit characteristic responses indicative of active fire.

*   **Scenario A1: Close Range & Low Ventilation**: This scenario simulated an early-stage fire in a confined space. A small flame source (e.g., candle or gas burner) was positioned 10-15 cm directly in front of the sensor array in a closed environment. Data collection commenced after 30 seconds of flame stabilization. Verification involved checking `flame` values (700-900) and rising `smoke` (the established data collection protocols).
*   **Scenario A2: Medium Range & Normal Ventilation**: This scenario represented a more developed fire with typical airflow. The flame source was placed 30-50 cm from the sensors in an open-ventilated space. `flame` values were expected to be moderate (400-700), reflecting the increased distance and dispersion (the established data collection protocols).
*   **Scenario A3: Smoldering**: To capture the signatures of slow, smoldering fires, materials like incense sticks or extinguished matches were used. These events primarily generate smoke and VOCs without an open flame, posing a distinct detection challenge for IR-based sensors (the established data collection protocols).


## 6.4.2 No-Fire Class: Idle Office, Kitchen Ambient

The "No-Fire" class aimed to establish a robust baseline of normal environmental conditions. This data is critical for training the model to recognize the absence of fire and differentiate it from both true fire events and false alarms. The scenarios focused on common indoor environments without any fire hazards or nuisance sources.

*   **Scenario B1: Baseline Room Air (Generic)**: This involved collecting data in a typical office or living room environment with no specific disturbances, establishing a general ambient baseline. Sensor readings were expected to be stable and low (the established data collection protocols).
*   **Scenario B2: Baseline Room Air (Closed Room)**: Data was collected in a sealed room (windows and doors closed) to observe sensor behavior in reduced airflow conditions. Readings were expected to remain stable and low (the established data collection protocols).
*   **Scenario B3: Baseline Room Air (Open Space)**: This scenario captured data in a well-ventilated area with open windows and doors, simulating environments with significant airflow. Sensor readings were verified to be stable and low (the established data collection protocols).
*   **Scenario B4: HVAC/Temp Transients**: To account for environmental fluctuations, data was collected during rapid temperature changes induced by HVAC systems or opening windows. Verification involved checking `temp` or `humid` columns for trends (the established data collection protocols).


## 6.4.3 False-Alarm Class: Cooking Fumes, Alcohol Vapors, Intense IR Light

The "False Alarm" class is specifically designed to address the project's key innovation: distinguishing common nuisance events from actual fires. These scenarios mimic typical false alarm triggers that often plague traditional fire detection systems, aiming to capture their unique multi-sensor fingerprints.

*   **Scenario C2: Steam**: Data was captured as steam (e.g., from a boiling kettle or hot shower) drifted towards the sensors. Expected sensor responses include significant `humid` spikes (70-85%), with `co` and `voc` remaining low (the established data collection protocols).


### References


