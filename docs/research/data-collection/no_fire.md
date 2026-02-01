# No-Fire Scenarios (Class: `no_fire`)

Four scenarios representing diverse baseline and environmental variance conditions.

## B1: Baseline Room Air (Generic) (`no_fire_base_room_air`)

**Setup:** room at rest, generic baseline conditions

**Expected:** smoke 80–120 ppm, flame ADC 0–50, temp natural (22–28°C), CO 200–300 ppm, VOC 400–600 ppm

**Collection:** 30 × 10 s files at 10 Hz

---

## B2: Baseline Room Air (Closed Room) (`no_fire_closed_room`)

**Setup:** sealed room (closed windows/doors), collect baseline with reduced airflow

**Expected:** smoke 80–130 ppm, flame ADC 0–50, temp stable (22–28°C), CO 200–350 ppm, VOC 400–650 ppm

**Collection:** 30 × 10 s files at 10 Hz

---

## B3: Baseline Room Air (Open Space) (`no_fire_open_space`)

**Setup:** open windows/doors, good ventilation, collect baseline with natural airflow

**Expected:** smoke 80–100 ppm, flame ADC 0–40, temp stable (22–28°C), CO 150–250 ppm, VOC 350–550 ppm

**Collection:** 30 × 10 s files at 10 Hz

---

## B4: High Humidity & Temperature Transients (`no_fire_hvac_transient`)

**Setup:** simulate AC/heating activation or window opening

**Expected:** smoke 80–150 ppm, flame 0–50 ADC, temp ramp 22–30°C, humidity shift 40%→70%+, CO 150–400 ppm, VOC 350–700 ppm

**Collection:** 30 × 10 s files at 10 Hz
