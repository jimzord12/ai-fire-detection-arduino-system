== Data Collection Guide

=== Controlled Scenarios
To train or re-train the TinyML model, data must be collected for three distinct scenarios:

1. *Idle (No Fire)*: Normal ambient conditions with standard levels of light, heat, and humidity.
2. *Fire (Active Combustion)*: Controlled exposure to small, contained flames (e.g., a candle or lighter) and smoke (e.g., from a extinguished match).
3. *False Alarm (Environmental Noise)*: Scenarios that typically trigger false positives, such as cooking steam, aerosols, and bright sunlight (for IR flame sensor noise).

=== Sampling Parameters
- *Duration*: Aim for 10-20 seconds per sample.
- *Total Dataset*: At least 15 minutes of data per class is recommended for high classification accuracy.
- *Sampling Rate*: Maintain 10Hz sampling (100ms interval) for all data acquisition.

=== Using Collection Scripts
For large-scale data collection, use the automated script:
```bash
./tools/collection/automated_data_collection.sh <label> <num_samples> <duration>
```
The script will automate the sampling process and save CSV files locally for later upload to the Edge Impulse Studio.
