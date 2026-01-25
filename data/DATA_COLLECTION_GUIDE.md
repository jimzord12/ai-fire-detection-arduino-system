# Data Collection Guide 📋

This guide provides step-by-step instructions for collecting training data for the Fire Detection System. Follow these steps exactly to ensure high-quality, reproducible data.

**Prerequisites:**
1.  **Arduino UNO R4** connected via USB (`/dev/ttyACM0`).
2.  **Flash** the `firmware/fireDetectionSystemV2.ino` sketch.
3.  **Terminal** open at the project root: `/home/jimzord12/projects/ai-fire-detection-arduino-system`.
4.  **Close** any other Serial Monitors (Arduino IDE, etc.).
5. **Ensure** that the sensor are warmed up for at least 30 minutes before starting data collection.

---

## 1. Class: Fire 🔥
**Goal:** Capture actual fire events with varying distances and ventilation.

### Scenario A1: Close Range & Low Ventilation
*   **Environment Preparation:**
    *   Close all windows and doors.
    *   Place sensor array on a stable surface.
    *   Light a candle or small gas burner.
    *   **Placement:** Place the flame **10-15 cm** directly in front of the sensors.
    *   Wait **30 seconds** for the flame to stabilize.
*   **Execution:**
    Run this command in your terminal:
    ```bash
    tools/collection/automated_data_collection.sh fire 30 10 close_low_vent
    ```
*   **Verification:**
    *   Check folder: `data/fire/close_low_vent/`
    *   Open a random CSV file.
    *   Verify `flame` values are high (700-900) and `smoke` is rising.

### Scenario A2: Medium Range & Normal Ventilation
*   **Environment Preparation:**
    *   Open windows/doors for normal airflow.
    *   Light the fire source.
    *   **Placement:** Move the flame **30-50 cm** away from the sensors.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh fire 30 10 medium_normal_vent
    ```
*   **Verification:**
    *   Check folder: `data/fire/medium_normal_vent/`
    *   Verify `flame` values are moderate (400-700).

### Scenario A3: Smoldering (Optional)
*   **Environment Preparation:**
    *   Use a smoldering material (e.g., incense stick, extinguished match).
    *   **Placement:** Place close to the smoke sensor.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh fire 30 10 smoldering
    ```

---

## 2. Class: No Fire 🟢
**Goal:** Capture baseline conditions to prevent false positives from normal environment changes.

### Scenario B1: Baseline Room Air
*   **Environment Preparation:**
    *   Ensure NO fire sources, smoke, or strong odors are present.
    *   Open windows/doors if weather permits.
    *   **Timing:** Perform this once in the Morning, Afternoon, and Evening.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh no_fire 30 10 base_room_air
    ```
*   **Verification:**
    *   Check folder: `data/no_fire/base_room_air/`
    *   Verify sensor readings are stable and low.

### Scenario B2: HVAC/Temp Transients
*   **Environment Preparation:**
    *   Turn on AC, Heater, or open a window to cause a rapid temp change.
    *   Wait for the temperature to start changing.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh no_fire 30 10 hvac_transient
    ```
*   **Verification:**
    *   Check folder: `data/no_fire/hvac_transient/`
    *   Verify `temp` or `humid` columns show a trend up or down.

---

## 3. Class: False Alarm ⚠️
**Goal:** Capture non-fire triggers that often confuse sensors (cooking, steam, sprays).

### Scenario C1: Cooking Fumes
*   **Environment Preparation:**
    *   Start cooking (e.g., frying) nearby.
    *   Wait until you can smell food or see light cooking haze.
    *   **Placement:** Place sensors safely near the cooking area (not directly over heat).
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh false_alarm 30 10 cooking
    ```
*   **Verification:**
    *   Check folder: `data/false_alarm/cooking/`
    *   Verify `voc` and `smoke` are elevated, but `co` remains low.

### Scenario C2: Steam
*   **Environment Preparation:**
    *   Boil a kettle or run a hot shower.
    *   Allow steam to drift towards the sensors.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh false_alarm 30 10 steam
    ```
*   **Verification:**
    *   Check folder: `data/false_alarm/steam/`
    *   Verify `humid` spikes (70-85%) but `co` and `voc` are low.

### Scenario C3: Sprays (Alcohol/Cleaner)
*   **Environment Preparation:**
    *   Spray an air freshener or cleaner **1-2 meters** away from sensors.
    *   **Do not** spray directly on the sensors.
*   **Execution:**
    Run this command:
    ```bash
    tools/collection/automated_data_collection.sh false_alarm 30 10 spray
    ```
*   **Verification:**
    *   Check folder: `data/false_alarm/spray/`
    *   Verify huge `voc` spike, but stable `temp` and `co`.

---

## General Verification Step ✅

After completing a session, run this command to count your files and ensure you met the target:

```bash
find data -name "*.csv" | cut -d/ -f2 | sort | uniq -c
```

**Expected Output (approximate):**
```
  90 fire
  90 no_fire
  90 false_alarm
```
