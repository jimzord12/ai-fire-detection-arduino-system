## Sensor Operational Verification Sketch Notes - System Verification & Validation

Keywords: Hardware-in-the-Loop (HIL) Testing, Power-On Self-Test (POST), Fault Detection and Isolation (FDI), Signal Conditioning.

Verification Strategy: Explain the difference between Functional Verification (checking if the sensor returns data) and Calibration Verification (checking if the data matches a known reference).

Fault Modes: Document common failure modes in multi-sensor systems:

Open Circuit: Detected by analog inputs floating to $V_{cc}$ or $GND$.

I2C Bus Jamming: Occurs if one device holds SDA low, preventing communication with all other devices (like the AHT20).

Stale Data: When a sensor initializes but stops updating registers (mitigated by the startMeasurementReady check).

Validation against Environment: Mention that for a fire detector, validation requires exposure to controlled smoke/heat to verify that the Sensor Fusion model triggers correctly under real-world conditions.

Academic Source: “Dependability of Wireless Sensor Networks: Fault Models and Solutions” (Discusses how to detect "silent failures" in digital sensors).
