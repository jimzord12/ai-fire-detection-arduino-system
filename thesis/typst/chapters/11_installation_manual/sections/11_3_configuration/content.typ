== Configuration

=== Edge Impulse Connection
To integrate the local hardware with the TinyML training pipeline:

1. Connect the Arduino via USB with the `fire-detection-main` firmware running.
2. Open a terminal and execute `edge-impulse-data-forwarder`.
3. Log in with your Edge Impulse account credentials and select the target project.
4. When prompted for sensor axes names, provide: `timestamp, smoke, voc, co, flame, temp, humid`.
5. Verify that data is streaming successfully in the Edge Impulse Studio dashboard.

=== Local Serial Logging
For local data analysis without the Edge Impulse cloud:

1. Configure the serial baud rate to 115200.
2. Use the `tools/legacy/logger-py/` script to log real-time sensor data.
3. The output will be in CSV format, including the internal `millis()` timestamp and raw 10-bit ADC values.
