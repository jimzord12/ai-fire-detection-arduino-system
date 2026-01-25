# Data Collection Strategy (moved)

This content has been split into smaller documents under `docs/research/data-collection/`.
See `docs/research/data-collection/README.md` for the Executive Summary and links to the split documents.

The original full content has been archived at `docs/research/data-collection/_archive_strategy.md`.

## Executive Summary

This document outlines a structured data collection protocol for training a TinyML-based fire detection model using Edge Impulse. The strategy employs a three-class classification approach (`fire`, `no_fire`, `false_alarm`) with sensor fusion from five DFRobot sensors integrated with an Arduino UNO R4 WiFi platform. The methodology prioritizes collecting representative "non-fire but suspicious" conditions to minimize false positive alarms while maintaining high true positive detection rates.

---

## 1. Introduction

### 1.1 Project Context

The fire detection system leverages **sensor fusion**—simultaneous correlation of data from multiple heterogeneous sensors—rather than relying on single-threshold detection methods. This multi-dimensional approach significantly improves classification accuracy and reduces nuisance alarms in real-world deployment scenarios.

### 1.2 Dataset Architecture

The training dataset is organized into three mutually exclusive classes:

| Class           | Purpose                    | Key Characteristics                                     |
| --------------- | -------------------------- | ------------------------------------------------------- |
| **fire**        | Actual fire events         | High flame/smoke/CO/VOC signatures                      |
| **no_fire**     | Baseline/normal conditions | Low sensor activation; natural variance                 |
| **false_alarm** | Non-fire trigger events    | High single-sensor response; contextual differentiation |

### 1.3 Rationale for Three-Class Design

The inclusion of a dedicated `false_alarm` class is critical. Single-threshold systems often trigger on cooking fumes or cleaning products, leading to alarm fatigue. By training the model to explicitly recognize these scenarios, we enable the classifier to distinguish between hazardous combustion products (CO, high-temperature signature) and benign volatile organic compounds (VOCs).

---

## 2. Data Collection Framework

### 2.1 Sampling Parameters

| Parameter                    | Value                    | Justification                                                                                  |
| ---------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Sampling Rate**            | 10 Hz (100 ms intervals) | Optimal for slow-moving sensors (temperature, humidity) while capturing flame flicker dynamics |
| **Sample Duration**          | 10 seconds per file      | Allows temporal correlation; manageable file size; sufficient for feature extraction           |
| **Total Duration per Class** | 15 minutes (90 samples)  | Empirical starting point from Edge Impulse best practices; baseline for classifier convergence |

### 2.2 Temporal Considerations

- **Time-of-day variance**: Collect `no_fire` data across morning, afternoon, and evening to capture natural circadian temperature/humidity variations
- **Environmental transients**: Capture rapid state changes (e.g., AC startup, door opening) to improve model robustness
- **Stability windows**: Ensure 2–3 seconds of stable sensor readings before triggering sample capture to avoid edge artifacts

### 2.3 Data Format Specification

All data is transmitted to Edge Impulse Data Forwarder in **comma-separated values (CSV)** format.

**CSV Columns:** `timestamp, smoke, voc, co, flame, temperature, humidity`

Example:

```
timestamp,smoke,voc,co,flame,temperature,humidity
1674091200000,423.5,512,28.3,45.2,25.0,15.0
1674091200100,425.1,518,28.4,45.3,25.1,15.2
...
```

**Key constraints:**

- Raw sensor values (no normalization on device)
- Values are floating-point for precision
- One row per 100 ms sample
- Header is added by the Data Forwarder or collection scripts (timestamp required by Edge Impulse for time-series data)

---

## 3. Class-Specific Collection Protocol

### 3.1 Class A: Fire (`fire`)

Three representative scenarios, each yielding 30 samples (5 minutes total per scenario).

#### 3.1.1 Scenario A1: Small Flame, Close Proximity, Low Ventilation

**Setup:**

- Place ignition source (candle or small gas burner) 10–15 cm from sensor array
- Seal room or reduce ventilation (closed door, windows shut) to concentrate products of combustion
- Allow flame to stabilize for 30 seconds before sampling

**Expected Sensor Signatures:**

- Smoke: 300–600 ppm
- Flame (IR): 700–900 ADC (high brightness)
- Temperature: +2–4°C rise
- CO: 50–150 ppm
- VOC: 200–400 ppm (combustion products)

**Sample Collection:**

- Capture 30 consecutive 10-second CSV files at 10 Hz
- Total duration: 5 minutes
- Label: `fire_close_low_vent`

---

#### 3.1.2 Scenario A2: Small Flame, Medium Distance, Normal Ventilation

**Setup:**

- Place ignition source 30–50 cm from sensors
- Maintain normal room ventilation (standard air exchange)
- Represent mid-range detection scenario

**Expected Sensor Signatures:**

- Smoke: 150–350 ppm
- Flame (IR): 400–700 ADC
- Temperature: +0.5–2°C rise
- CO: 20–80 ppm
- VOC: 100–250 ppm

**Sample Collection:**

- Capture 30 consecutive 10-second CSV files
- Total duration: 5 minutes
- Label: `fire_medium_normal_vent`

---

#### 3.1.3 Scenario A3 (Optional): Smoldering / Smoke-Dominant Fire

**Setup:**

- Create low-oxygen burn (e.g., damp wood, smoldering materials)
- Emphasis on smoke and CO rather than flame visibility
- Represents slow-burn detection scenario

**Expected Sensor Signatures:**

- Smoke: 500–900 ppm (high)
- Flame (IR): 200–400 ADC (low; flames obscured)
- Temperature: +1–3°C
- CO: 100–300 ppm (elevated)
- VOC: 350–600 ppm

**Sample Collection:**

- Capture 30 consecutive 10-second CSV files
- Total duration: 5 minutes
- Label: `fire_smoldering`

---

**Subtotal for Fire Class: 15 minutes (90 samples)**

---

### 3.2 Class B: No Fire (`no_fire`)

Three scenarios representing baseline and environmental variance.

#### 3.2.1 Scenario B1: Baseline Room Air (Across Times of Day)

**Setup:**

- Room at rest with no sources of heat, flame, or artificial aerosols
- Collect during morning (before temperature rise), afternoon (peak heat), and evening (cooling)
- Open ventilation (windows/door) if safe

**Expected Sensor Signatures:**

- Smoke: 0–50 ppm (ambient baseline, possibly street pollution)
- Flame (IR): 50–150 ADC (no IR source)
- Temperature: Natural ambient (22–28°C depending on time)
- CO: <5 ppm
- VOC: <50 ppm

**Sample Collection:**

- 10 files at 8:00 AM, 10 files at 14:00 PM, 10 files at 20:00 PM (30 total)
- Each session: 100 seconds continuous, split into 10-second samples
- Label: `no_fire_baseline`

---

#### 3.2.2 Scenario B2: High Humidity & Temperature Transients

**Setup:**

- Simulate rapid environmental change (e.g., AC/heating activation, window opening)
- Observe sensor drift without combustion present
- Critical for reducing false positives from HVAC systems

**Expected Sensor Signatures:**

- Smoke: 0–60 ppm (no change from ventilation airflow alone)
- Flame (IR): 50–150 ADC (stable)
- Temperature: Ramp from 22°C to 30°C or vice versa (±2°C/minute)
- Humidity: Shift from 40% to 70%+ or vice versa
- CO: <5 ppm
- VOC: <80 ppm (no combustion)

**Sample Collection:**

- Trigger AC or open window; collect 30 consecutive 10-second samples
- Total duration: 5 minutes
- Label: `no_fire_hvac_transient`

---

#### 3.2.3 Scenario B3 (Optional): Dusty Air & Fan Airflow

**Setup:**

- Run ceiling fan or portable fan near sensors
- Create light dust cloud (vacuum cleaner suction near sensors, or window sill dust) to test smoke sensor response to particulates
- Determines sensitivity to non-combustion particulates

**Expected Sensor Signatures:**

- Smoke: 80–150 ppm (high particulate, but no combustion odor)
- Flame (IR): 50–200 ADC (may vary with airflow reflections)
- Temperature: Stable or ±0.5°C from air circulation
- CO: <5 ppm
- VOC: <80 ppm

**Sample Collection:**

- Capture 30 consecutive 10-second samples during fan operation
- Total duration: 5 minutes
- Label: `no_fire_dust_airflow`

---

**Subtotal for No-Fire Class: 15 minutes (90 samples)**

---

### 3.3 Class C: False Alarm (`false_alarm`)

Three scenarios with high sensor activation but NO fire hazard.

#### 3.3.1 Scenario C1: Cooking Fumes (Frying/High-Heat Cooking)

**Setup:**

- Use electric stove or stovetop with oil/butter frying
- Maintain active cooking (moderate flame or high electric heat) for 5 minutes
- Represent the most common nuisance alarm trigger

**Expected Sensor Signatures:**

- Smoke: 250–500 ppm (visible haze from cooking oil aerosolization)
- Flame (IR): 300–600 ADC (if gas stove; 50–150 ADC if electric)
- Temperature: +1–2°C (localized, not sustained room rise)
- CO: <10 ppm (food combustion ≠ structural fire)
- VOC: 150–350 ppm (cooking odors, not hazardous levels)

**Key Differentiator:** Low CO; high VOC/smoke from food rather than wood/materials.

**Sample Collection:**

- Start sampling as cooking begins
- Capture 30 consecutive 10-second samples
- Total duration: 5 minutes
- Label: `false_alarm_cooking`

---

#### 3.3.2 Scenario C2: Steam (Kettle / Hot Shower)

**Setup:**

- Boil kettle or run hot shower in adjacent/nearby room
- Allow steam to drift toward sensors
- Test response to water vapor (distinct from combustion smoke)

**Expected Sensor Signatures:**

- Smoke: 80–150 ppm (moisture particles detected as "smoke" by MEMS sensor)
- Flame (IR): 50–150 ADC (no flame)
- Temperature: +0.5–1.5°C (modest rise from steam diffusion)
- Humidity: Jump from 45% to 70–85%
- CO: <3 ppm
- VOC: <40 ppm

**Key Differentiator:** Humidity spike without CO rise; water vapor not combustion.

**Sample Collection:**

- Synchronize sampling with steam source
- Capture 30 consecutive 10-second samples
- Total duration: 5 minutes
- Label: `false_alarm_steam`

---

#### 3.3.3 Scenario C3: Aerosol Sprays / Cleaning Products / Alcohol Vapors

**Setup:**

- Spray air freshener, disinfectant, or alcohol-based cleaner in room with sensors
- Create momentary VOC spike without combustion
- Represent indoor chemical hazards that should NOT trigger fire alarm

**Expected Sensor Signatures:**

- Smoke: 150–300 ppm (particulate spray, not smoke)
- Flame (IR): 50–150 ADC (no IR source)
- Temperature: Stable (spray at room temperature)
- CO: <2 ppm
- VOC: 300–500 ppm (volatile organic compounds from product)

**Key Differentiator:** High VOC without CO; no temperature rise.

**Sample Collection:**

- Spray product 1–2 meters from sensors; allow dispersal
- Capture 30 consecutive 10-second samples (covering spray event + 4 minutes decay)
- Total duration: 5 minutes
- Label: `false_alarm_voc_spray`

---

**Subtotal for False-Alarm Class: 15 minutes (90 samples)**

---

## 4. Total Dataset Summary

| Class           | Scenarios                   | Duration per Scenario | Total Duration | Sample Count |
| --------------- | --------------------------- | --------------------- | -------------- | ------------ |
| **fire**        | 3 (required) + 1 (optional) | 5 minutes             | 15 minutes     | 90           |
| **no_fire**     | 3 (required) + 1 (optional) | 5 minutes             | 15 minutes     | 90           |
| **false_alarm** | 3 (required)                | 5 minutes             | 15 minutes     | 90           |
|                 |                             |                       | **45 minutes** | **270**      |

---

## 5. Data Collection Procedure

### 5.1 Equipment & Software Setup

1. **Arduino Sketch**: Deploy data collection firmware (10 Hz serial output)
2. **Edge Impulse Data Forwarder**: Running on connected PC/laptop
3. **Edge Impulse Project**: Pre-configured with label names (`fire`, `no_fire`, `false_alarm`)
4. **Sensors**: All five DFRobot sensors calibrated and verified functional

### 5.2 Collection Workflow

**For each scenario:**

1. **Initialize** the sensor array (warm-up ~30 seconds)
2. **Start** the Data Forwarder stream
3. **Trigger** the scenario condition (ignite flame, spray product, etc.)
4. **Wait** 2–3 seconds for sensors to stabilize
5. **Begin** 10-second sample capture
6. **Repeat** 30 times (5 minutes total per scenario)
7. **Stop** streaming; verify data received in Edge Impulse Studio
8. **Label** samples with appropriate class and scenario tag

### 5.3 Quality Assurance

- **Verify serial output** in Arduino IDE Monitor before each session (no dropped frames)
- **Check Data Forwarder** connection status (green indicator; no timeout warnings)
- **Visual inspection** of raw CSV in Edge Impulse (plot sensor ranges; detect anomalies)
- **Re-collect** any scenario with <25 complete samples or obvious sensor malfunction

### 5.4 Automated Data Collection Script 🔧

We provide a simple Bash script to automate repetitive sample captures: `tools/collection/automated_data_collection.sh`. The script repeatedly reads a fixed-duration stream from the Arduino serial port and writes timestamped CSV files under `data/<label>/` or `data/<label>/<scenario>/`.

**Setup (run once):**

```bash
chmod +x tools/collection/automated_data_collection.sh
```

**Usage:**

```bash
tools/collection/automated_data_collection.sh <label> <num_samples> <duration_seconds> [scenario]
```

**Examples:**

1. **Basic collection** (flat structure):

   ```bash
   tools/collection/automated_data_collection.sh fire 30 10
   ```

   - Collects 30 samples of 10 seconds each
   - Saves to: `data/fire/fire_YYYYMMDD_HHMMSS_N.csv`

2. **With scenario** (organized structure):

   ```bash
   tools/collection/automated_data_collection.sh no_fire 30 10 base_room_air
   ```

   - Collects 30 samples of 10 seconds each
   - Saves to: `data/no_fire/base_room_air/no_fire__base_room_air_YYYYMMDD_HHMMSS_N.csv`

3. **Full collection workflow** (example: Scenario A1 from Section 3.1.1):
   ```bash
   # Set up ignition source, wait for flame to stabilize
   tools/collection/automated_data_collection.sh fire 30 10 close_low_vent
   ```

**Configuration notes:**

- **Serial port:** Defaults to `/dev/ttyACM0`. Edit `SERIAL_PORT` variable in script if your Arduino uses a different port.
- **CSV format:** Header is added automatically: `timestamp,smoke,voc,co,flame,temperature,humidity` (timestamp in ms, required by Edge Impulse for time-series data)
- **Data validation:** The script filters out partial/malformed lines, keeping only valid 7-column rows (timestamp + 6 sensors) and adding timestamps at 100ms intervals.
- **Fail-safes:** Files with no data are removed; 2-second pause between samples.

**Tip:** The scenario parameter aligns with the collection protocol outlined in Section 3, making it easy to organize data by experimental conditions.

### 5.5 Uploading to Edge Impulse Cloud 📤

A companion script `tools/integration/upload_to_edge_impulse.sh` simplifies uploading collected samples to your Edge Impulse project.

**Setup (run once):**

```bash
# 1. Make script executable
chmod +x tools/integration/upload_to_edge_impulse.sh

# 2. Install Edge Impulse CLI (if not already installed)
npm install -g edge-impulse-cli

# 3. Log in to your Edge Impulse account
edge-impulse-login
```

**Usage:**

```bash
tools/integration/upload_to_edge_impulse.sh <label> [scenario] [category]
```

**Parameters:**

- `label` - Class name (required): `fire`, `no_fire`, or `false_alarm`
- `scenario` - Scenario subdirectory (optional): e.g., `base_room_air`, `close_low_vent`
- `category` - Dataset split (optional): `training` (default) or `testing`

**Examples:**

1. **Upload all files from a label** (flat structure):

   ```bash
   tools/integration/upload_to_edge_impulse.sh fire
   ```

   - Uploads all CSV files from `data/fire/` to training set

2. **Upload specific scenario** (organized structure):

   ```bash
   tools/integration/upload_to_edge_impulse.sh no_fire base_room_air
   ```

   - Uploads files from `data/no_fire/base_room_air/` to training set

3. **Upload to testing dataset:**

   ```bash
   tools/integration/upload_to_edge_impulse.sh false_alarm cooking testing
   ```

   - Uploads files from `data/false_alarm/cooking/` to testing set

4. **Complete workflow example:**

   ```bash
   # Collect data
   tools/collection/automated_data_collection.sh fire 30 10 close_low_vent

   # Review files (optional)
   ls -lh data/fire/close_low_vent/

   # Upload to Edge Impulse
   tools/integration/upload_to_edge_impulse.sh fire close_low_vent
   ```

**Script features:**

- Validates directory existence and file count before upload
- Prompts for confirmation to prevent accidental uploads
- Automatically applies correct label for classification
- Provides direct link to Edge Impulse Studio after successful upload

---

## 6. Storage & Organization

### 6.1 File Naming Convention

```
[Date]_[Class]_[Scenario]_[Run].csv

Examples:
2025-01-15_fire_close_low_vent_001.csv
2025-01-15_no_fire_baseline_am_001.csv
2025-01-15_false_alarm_cooking_001.csv
```

### 6.2 Metadata Log

Maintain a spreadsheet recording:

- Date and time of collection
- Class and scenario label
- Environmental conditions (room temperature, humidity, ventilation)
- Sensor calibration notes
- Any anomalies or issues

---

## 7. Expected Outcomes & Validation

### 7.1 Class Separability

After 15 minutes per class, we expect:

| Pair                        | Differentiating Features                              | Confidence           |
| --------------------------- | ----------------------------------------------------- | -------------------- |
| **fire vs. no_fire**        | CO elevation; temperature rise; smoke spike           | **High** (~95%+)     |
| **fire vs. false_alarm**    | Sustained CO rise (fire ≠ cooking); temperature trend | **Medium** (~85–90%) |
| **false_alarm vs. no_fire** | VOC spike; moisture rise; absence of CO               | **High** (~90%+)     |

### 7.2 Training & Evaluation

- **Train/Test Split**: 80% training, 20% test (stratified by scenario)
- **DSP Blocks**: Spectral features (for time-series correlation) on flame and smoke; raw features on slow-moving temperature/humidity
- **Model Type**: Neural Network (int8 quantization for Cortex-M4 deployment)
- **Target Accuracy**: ≥90% on test set; <5% false positive rate on `no_fire` and `false_alarm` classes combined

---

## 8. Conclusion

This data collection strategy provides a balanced, scenario-driven foundation for training a robust multi-sensor fire detection classifier. The emphasis on false-alarm scenarios ensures that the final deployed model will discriminate between actual fire hazards and common household triggers, reducing unnecessary alarms while maintaining high sensitivity to real threats.

The 45-minute dataset (270 samples across 9 scenarios) represents a practical starting point aligned with Edge Impulse best practices. Additional data collection during model refinement cycles can expand coverage of edge cases and seasonal variations.

---

## References

1. Edge Impulse. (2024). Data Acquisition and Collection Best Practices. Retrieved from https://docs.edgeimpulse.com/studio/projects/data-acquisition
2. Deng, X., et al. (2023). An Indoor Fire Detection Method Based on Multi-Sensor Fusion. _IEEE Sensors Journal_, 23(24), 30451–30461.
3. Kim, G. L., et al. (2024). A Multi-Sensor Fire Detection Method based on Trend Value Extraction. _Journal of Systems and Software Technology (JSST)_.
4. Muñoz, A., & Manzini, P. (2023). Sensor Fusion Strategies for IoT-based Fire Detection Systems. _IoT Research Today_, 12(3), 145–162.
5. Renesas. (2024). Arduino UNO R4 WiFi Technical Specifications. https://www.renesas.com
