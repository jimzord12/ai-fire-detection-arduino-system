== Validation of Clean Fire Detection (The Lighter Case Study)

To evaluate the effectiveness of the hybrid decision fusion logic in real-world scenarios, a specific test case was conducted using a clean-burning butane lighter at a distance of 5 cm. This scenario represents a "Clean Fire" signature—high infrared radiation with negligible smoke and carbon monoxide—which often challenges multi-sensor fusion models trained on smoky laboratory fires.

=== The Fusion Conflict and AI Hesitation

Analysis of the real-time inference logs (@tbl:lighter-test-data) reveals a significant "Fusion Conflict." Despite a clear and intense flame signal (Flame > 900), the TinyML model initially assigned a 100% probability to the `no_fire` class.

#figure(
  table(
    columns: (auto, auto, auto, auto, auto, auto),
    inset: 10pt,
    align: horizon,
    [*Time (ms)*], [*Smoke*], [*Flame*], [*AI Fire Prob*], [*AI No-Fire*], [*System Status*],
    [131462], [75], [970], [0.00], [1.00], [CRITICAL OVERRIDE],
    [131627], [75], [965], [0.00], [1.00], [CRITICAL OVERRIDE],
    [131792], [76], [972], [0.00], [1.00], [ALARM TRIGGERED],
  ),
  caption: [System behavior during butane lighter test (5 cm distance).],
) <tbl:lighter-test-data>

This behavior confirms that the machine learning model had over-fitted to the "Smoky" characteristics of the training dataset. Because the current sensor inputs (Low Smoke, Low CO) did not match the learned "Fire" template, the AI correctly (from its perspective) classified the event as a non-fire anomaly or potential sunlight.

=== Hardware Override Success

The hybrid logic successfully mitigated this AI failure through the Stage 3 Critical Override. As the Flame sensor reading exceeded the deterministic threshold of 800, the system bypassed the AI's hesitation. The alarm was triggered after the 3-count temporal verification period, even while the AI model remained 100% confident that no fire was present.

This case study demonstrates the necessity of a hybrid architecture in life-safety systems. While the AI provides superior rejection of complex nuisances (e.g., distinguishing cooking fumes from smoke), deterministic hardware "reflexes" ensure that the system remains responsive to intense, clean-burning fire sources that fall outside the model's learned distribution.
