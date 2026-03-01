# Thesis Table Inventory & Proposals

This document outlines the 5 most critical tables to be integrated into the thesis to enhance data clarity and structural comparison.

## 1. Literature Review: Comparative Analysis

**Placement**: Chapter 2, Section 2.4 (False Alarm Mitigation and Research Synthesis)
**Purpose**: To contextualize this research within the current state-of-the-art.

| Research Study              | Sensors Used        | Classification Type | Primary Innovation                     | Reported Accuracy |
| :-------------------------- | :------------------ | :------------------ | :------------------------------------- | :---------------- |
| **Fonollosa et al. (2018)** | Chemical/Gas        | Binary              | Early detection of chemical fires      | 92.4%             |
| **Wang et al. (2023)**      | Multi-modal         | 3-Class             | Identification of CO as "Truth Sensor" | 98.1%             |
| **Meleti et al. (2024)**    | Thermal/Optical     | Binary              | Obscured fire detection via IR         | 95.0%             |
| **This Work (2026)**        | **6-Sensor Fusion** | **3-Class**         | **TinyML False Alarm Recognition**     | **100% (Lab)**    |

---

## 2. Hardware: Sensor Specification Matrix

**Placement**: Chapter 4, Section 4.2 (Detailed Examination of Selected Sensors)
**Purpose**: To provide a technical summary of the node's sensing capabilities.

| Sensor Model | Modality          | Detection Range | Interface | Key Advantage                           |
| :----------- | :---------------- | :-------------- | :-------- | :-------------------------------------- |
| **SEN0570**  | Smoke/Particulate | Analog (Rel.)   | Analog    | Ethanol Compatible (Low False Positive) |
| **DFR0076**  | IR Flame          | 760nm – 1100nm  | Analog    | < 1ms Response Time (Flicker Analysis)  |
| **SEN0566**  | VOC Gas           | 0 – 1000 ppm    | Analog    | Rapid Response to Chemical Vapors       |
| **SEN0564**  | Carbon Monoxide   | 1 – 1000 ppm    | Analog    | High Selectivity (Combustion Truth)     |
| **AHT20**    | Temp/Humidity     | -40 to +85°C    | I2C       | ±0.3°C Accuracy (Heat Paradox Analysis) |

---

## 3. Architecture: Asymmetric Multi-Processing (AMP) Split

**Placement**: Chapter 5, Section 5.1 (The Autonomous Edge-Node Architecture)
**Purpose**: To define the functional separation between the "Brain" and the "Backbone."

| Feature               | RA4M1 "Inference Brain"        | ESP32-S3 "Connectivity Backbone" |
| :-------------------- | :----------------------------- | :------------------------------- |
| **Primary Role**      | Sensing, DSP, TinyML Inference | WiFi, MQTT, Security, Telemetry  |
| **Core Architecture** | ARM Cortex-M4 (32-bit)         | Xtensa LX7 (Dual-core)           |
| **Clock Speed**       | 48 MHz                         | 240 MHz                          |
| **Critical Resource** | Floating Point Unit (FPU)      | Integrated WiFi/Bluetooth Radio  |
| **Data Flow**         | Master (Decision Maker)        | Slave (Communication Bridge)     |

---

## 4. Methodology: Data Collection Scenario Catalog

**Placement**: Chapter 6, Section 6.4 (Class-Specific Data Collection Scenarios)
**Purpose**: To map the environmental triggers used to train the multi-sensor model.

| Class           | ID  | Scenario Name       | Primary Physical Signature                |
| :-------------- | :-- | :------------------ | :---------------------------------------- |
| **Fire**        | A1  | Close Range Flame   | High Flame (>800), Rising Smoke/CO        |
| **Fire**        | A3  | Smoldering Material | High Smoke/VOC, Low Flame IR              |
| **No-Fire**     | B1  | Ambient Office      | Stable Baseline (Low readings across all) |
| **False Alarm** | C1  | Cooking Fumes       | **High VOC/Smoke, Negligible CO**         |
| **False Alarm** | C2  | Steam / Humidity    | **High Humidity (>80%), Stable CO/VOC**   |
| **False Alarm** | C3  | Alcohol Sprays      | **Extreme VOC Spikes, Stable Flame/CO**   |

---

## 5. Economics: Estimated Bill of Materials (BOM)

**Placement**: Chapter 9, Section 9.4 (Deployment Scenarios and Scalability)
**Purpose**: To provide financial justification for the "Autonomous Node" approach.

| Component Category   | Specific Item             | Est. Unit Cost (USD) | % of Total |
| :------------------- | :------------------------ | :------------------- | :--------- |
| **Microcontroller**  | Arduino UNO R4 WiFi       | $27.50               | 34%        |
| **Chemical Sensing** | Smoke, VOC, CO Sensors    | $35.00               | 43%        |
| **Environmental**    | Flame, Temp/Hum Sensors   | $12.00               | 15%        |
| **Infrastructure**   | Enclosure, Wiring, PCB    | $6.50                | 8%         |
| **Total Node Cost**  | **Fully Integrated Unit** | **$81.00**           | **100%**   |
