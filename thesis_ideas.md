# Thesis Ideas: Fire Detector using Sensor Fusion with TinyML on Arduino UNO R4 WiFi

The Thesis should be divided into 2 main parts:

1. The Theory: Sensor Overview and Integration
2. The Practical: Implementation and Testing

## The Theory: Sensor Overview and Integration

### Small Chapter for each Sensor

#### Introduction to the Sensors

#### Communication Protocol (I2C, SPI, UART, etc)

#### Pinout and Wiring (specific to Arduino UNO R4 WiFi)

#### Date Collection Strategy (sampling rate, duration)

- Best Practices: Capture data from multiple angles and distances, rotate objects and camera positions, and vary environmental conditions (wind, humidity, ambient temperature). For non-fire scenarios, collect data from various locations in the target deployment environment, include scenarios that might trigger false positives (steam, bright lights, reflections, dust, fog), and capture different times of day and weather conditions.

#### Data Characteristics (range, accuracy, resolution)

#### Calibration Procedures (if applicable)

#### Integration with TinyML (pre-processing steps, normalization)

#### Observed Behavior in Testing (stability, response time, anomalies)

#### Challenges Faced and Solutions Implemented

### Research on Fire Detection systems

- For For sensor-based detection, collect at least 10 minutes of data per class, with 13+ minutes being a proven baseline for environmental sensor fusion. For time-series data, ensure sufficient temporal coverage to capture fire development dynamics.

## The Practical: Implementation and Testing

### System Architecture

#### Overview of the Fire Detector System

#### Sensor Fusion Strategy

#### TinyML Model Design and Training

- Train/Test Split Strategy - Edge Impulse recommends an 80/20 split between training and testing data as the standard approach. The platform can automatically split your data when you select "Split automatically (80/20)" during collection. For larger datasets (10,000+ samples), you may use a 90/10 or even 95/5 split. Always maintain a separate test set that the model has never seen during training to validate real-world performance. Some practitioners also reserve a small validation set (5-10%) for hyperparameter tuning.

#### Arduino UNO R4 WiFi Implementation

#### Code Structure and Key Functions

### Environment Setup

- Use this script to findout if you have all the deps: `scripts\check-edge-impulse-env.ps1` its Windows only for now.
- Issues I faced: When trying to download the Edge Impulse CLI tool using npm, I encountered an issue saying that Windows SDK was not available. I had to download the Visual Studio Installer and install the "Desktop development with C++" workload to resolve this. However, it did not solve the issue as it only allows the installation of the Windows 11 SDK, while the Edge Impulse CLI tool requires the **Windows 10 SDK**. To fix this, I manually download and install the Windows 10 SDK from the official Microsoft website (https://learn.microsoft.com/en-us/windows/apps/windows-sdk/downloads).

Still Windows 10 SDK failed. What finally worked: `notes\env-setup-troubleshooting.md`

- Mention about the 2 sketches:

  - Actual Sensor Reading and Data Logging
  - The Sensor Operational Check

- Mention that in the start we used a UV Python project to capture the data from the USB COM port and log it into CSV files. But later we moved to Edge Impulse cli tool to directly upload the data to Edge Impulse.

### Testing and Results

- Test Environment Setup - description of the physical setup, e.g, room size, ventilation, etc.
- Data Collection Procedures - how data was collected from sensors, e.g, duration, frequency
- Test Scenarios - different fire and non-fire scenarios tested - e.g, open flame, smoke, steam
- Performance Metrics (accuracy, response time) - definition of metrics used to evaluate the system, e.g, confusion matrix, precision, recall
- Analysis of Results - interpretation of the results, e.g, strengths, weaknesses

### Conclusion and Future Work

- Summary of Findings
- Limitations of the Current Implementation
- Suggestions for Future Research and Improvements
