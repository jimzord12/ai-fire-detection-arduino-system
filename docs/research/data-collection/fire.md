# Fire Scenarios (Class: `fire`)

Three representative scenarios, each yielding 30 samples (5 minutes total per scenario).

## A1: Small Flame, Close Proximity, Low Ventilation (`fire_close_low_vent`)

**Setup:**

- Place ignition source (candle or small gas burner) 10–15 cm from sensor array
- Seal room or reduce ventilation
- Allow flame to stabilize for 30 seconds before sampling

**Expected Signatures:** smoke 300–600 ppm, flame (IR) 700–900 ADC, temp +2–4°C, CO 50–150 ppm, VOC 200–400 ppm

**Collection:** 30 × 10 s files at 10 Hz

---

## A2: Small Flame, Medium Distance, Normal Ventilation (`fire_medium_normal_vent`)

**Setup:** ignition 30–50 cm away, normal ventilation

**Expected Signatures:** smoke 150–350 ppm, flame 400–700 ADC, temp +0.5–2°C, CO 20–80 ppm, VOC 100–250 ppm

**Collection:** 30 × 10 s files at 10 Hz

---

## A3 (Optional): Smoldering / Smoke-Dominant Fire (`fire_smoldering`)

**Setup:** low-oxygen burn (damp wood, smoldering materials)

**Expected Signatures:** smoke 500–900 ppm, flame 200–400 ADC, temp +1–3°C, CO 100–300 ppm, VOC 350–600 ppm

**Collection:** 30 × 10 s files at 10 Hz
