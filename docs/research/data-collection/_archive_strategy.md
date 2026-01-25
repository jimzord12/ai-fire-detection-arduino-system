# Archive: Original Data Collection Strategy

This file is an archive copy of the original `data/strategy.md` file prior to splitting into smaller documents.

---

# Data Collection Strategy for Multi-Sensor Fire Detection System

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

All data is transmitted to Edge Impulse Data Forwarder in **comma-separated values (CSV)** format:

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
- No header row in CSV stream (added by Data Forwarder)

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

**Subtotal for No-Fire Class: 15 minutes (90 samples)**n

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

... (truncated in read_file output)
