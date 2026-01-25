# No-Fire Scenarios (Class: `no_fire`)

Three scenarios representing baseline and environmental variance.

## B1: Baseline Room Air (Across Times of Day) (`no_fire_baseline`)

**Setup:** room at rest, collect morning/afternoon/evening

**Expected:** smoke 0–50 ppm, flame ADC 50–150, temp natural (22–28°C), CO <5 ppm, VOC <50 ppm

**Collection:** 10 files at 8:00, 10 at 14:00, 10 at 20:00 (30 total)

---

## B2: High Humidity & Temperature Transients (`no_fire_hvac_transient`)

**Setup:** simulate AC/heating activation or window opening

**Expected:** smoke 0–60 ppm, flame 50–150 ADC, temp ramp 22–30°C, humidity shift 40%→70%+, CO <5 ppm, VOC <80 ppm

**Collection:** 30 × 10 s samples

---

## B3 (Optional): Dusty Air & Fan Airflow (`no_fire_dust_airflow`)

**Setup:** fan running, light dust cloud

**Expected:** smoke 80–150 ppm (particulates), flame 50–200 ADC, temp stable, CO <5 ppm, VOC <80 ppm

**Collection:** 30 × 10 s samples
