== Maintenance & Troubleshooting

=== Sensor Health Checks
To verify the operational status of all sensors, the `firmware/diagnostics/verify_all_sensors_operational.ino` sketch should be run. This will output diagnostic flags for each sensor:

- *AHT20 Failure*: Check I2C wiring (SDA/SCL) and ensure 5V power.
- *Analog Sensor Zero-Values*: If Smoke, VOC, or CO sensors read 0 persistently, check for loose analog pin connections or power delivery issues.

=== Troubleshooting False Positives
If the system triggers an alarm in the absence of combustion:

- *Solar Glare*: IR flame sensors are sensitive to direct sunlight. Reposition the sensing node away from windows.
- *VOC Drift*: MEMS gas sensors require a warm-up period (approximately 1-2 minutes) to reach a stable baseline.
- *Calibration*: Use the `Edge Impulse Live Classification` tool to identify which sensor axis is triggering the misclassification and retrain the model with that noise source included.

=== Future Expansion
The system can be expanded via the Arduino UNO R4 WiFi's ESP32-S3 module:
- *MQTT Integration*: Send sensor logs and alerts to a central dashboard.
- *OTA Updates*: Deploy new TinyML models over-the-air.
- *GitHub Repository*: For the latest firmware and dataset updates, visit: [GITHUB_REPO_LINK].
