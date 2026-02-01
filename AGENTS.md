# AI Fire Detection Arduino System - Agent Guidelines

An autonomous multi-sensor fire detection node leveraging sensor fusion and TinyML for intelligent fire detection with minimal false alarms.

---

## Project Overview

**Goal**: Develop an intelligent edge-deployed fire detection system using an Arduino UNO R4 WiFi microcontroller with multi-sensor fusion to distinguish between real fires, normal environmental conditions, and false alarm triggers (e.g., cooking fumes, cleaning products).

**Key Innovation**: Three-class classification (fire/no_fire/false_alarm) rather than binary detection, reducing false positives through explicit recognition of common trigger scenarios.

**Target Application**: Stationary autonomous nodes for building automation, home safety systems, and industrial monitoring with real-time MQTT telemetry.

---

## Technology Stack

| Category            | Technology                                                     |
| ------------------- | -------------------------------------------------------------- |
| **Microcontroller** | Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3)                 |
| **Sensors**         | 5x DFRobot MEMS sensors (smoke, VOC, CO, flame, temp/humidity) |
| **ML Framework**    | Edge Impulse (TinyML model deployment)                         |
| **Firmware**        | Arduino IDE / Arduino CLI (C++)                                |
| **Data Tools**      | Python (serial logging), Bash (automation)                     |
| **Communications**  | MQTT (WiFi via ESP32-S3 co-processor)                          |

---

## Hardware Components

| Sensor          | Model                          | Purpose                             |
| --------------- | ------------------------------ | ----------------------------------- |
| Smoke Detection | DFRobot SEN0570 (Fermion MEMS) | Detects particulate smoke           |
| Flame Detection | DFRobot DFR0076 (IR Sensor)    | 760nm–1100nm IR flame signature     |
| VOC Detection   | DFRobot SEN0566 (Fermion MEMS) | Volatile Organic Compounds          |
| CO Detection    | DFRobot SEN0564 (Fermion MEMS) | Carbon Monoxide (combustion marker) |
| Env. Monitoring | DFRobot SEN0527 (AHT20)        | Temperature & Humidity              |

---

## Data Collection & ML Pipeline

- **Sampling Rate**: 10 Hz (100 ms intervals)
- **Sample Duration**: 10 seconds per capture
- **Dataset Structure**: Three classes (fire, no_fire, false_alarm)
- **Target Training Data**: 15 minutes per class minimum
- **Model Optimization**: Quantized neural networks for Cortex-M4 deployment
- **Inference Latency Target**: <100 ms per prediction

---

## Build & Deployment Commands

### Arduino Firmware

```bash
# Compile sketch
arduino-cli compile --fqbn arduino:renesas_uno:arduino_uno_r4_wifi firmware/main/fire-detection-main/fire-detection-main.ino

# Upload to device
arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:renesas_uno:arduino_uno_r4_wifi firmware/main/fire-detection-main/fire-detection-main.ino
```

### Python Tools

```bash
# Lint and format
cd tools/legacy/logger-py && ruff check . && ruff format .

# Run serial data logger
cd tools/legacy/logger-py && python logger.py
```

### Automated Data Collection

```bash
# Collect labeled sensor data
./tools/collection/automated_data_collection.sh <label> <num_samples> <duration> [scenario]

# Upload to Edge Impulse
./tools/integration/upload_to_edge_impulse.sh <label> [scenario]

# Environment validation
./tools/setup/check-edge-impulse-env.sh
```

---

## Code Style Guidelines

### Python (logger/)

- **Imports**: Standard library first, then third-party (alphabetical within groups)
- **Type Hints**: Modern Python 3.13+ syntax (PEP 695 union types)
- **Naming**: `snake_case` for functions/variables, `UPPER_CASE` for constants, `_prefix` for private
- **Formatting**: `ruff format` for consistency, 4-space indentation
- **Error Handling**: Specific exception types; meaningful exit codes

### Arduino C++

- **Configuration**: Static const structs for sensor mappings
- **Sampling**: 10 Hz tick interval; stable baseline detection before capture
- **I2C Stability**: 500ms wait after initialization; 5s retry interval for AHT20
- **Serial Output**: CSV format with timestamp, 6 sensor values
- **Diagnostics**: Built-in sensor health checks; fault flags

---

## Document Index

| Document                    | Path                                                                                                                   | Purpose                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Project README**          | [README.md](README.md)                                                                                                 | Project overview, component inventory, setup                           |
| **Task List**               | [TODO.md](TODO.md)                                                                                                     | Active tasks, thesis migration, data analysis                          |
| **Agent Guidelines**        | [docs/research/AGENTS.md](docs/research/AGENTS.md)                                                                     | Build commands, code style (reference)                                 |
| **Super Guide**             | [docs/guides/super-guide.md](docs/guides/super-guide.md)                                                               | Comprehensive end-to-end setup & operation                             |
| **Day-to-Day Setup**        | [docs/guides/DAY-TO-DAY-SETUP.md](docs/guides/DAY-TO-DAY-SETUP.md)                                                     | Quick startup procedures & troubleshooting                             |
| **Data Collection Guide**   | [data/DATA_COLLECTION_GUIDE.md](data/DATA_COLLECTION_GUIDE.md)                                                         | Practical data capture procedures                                      |
| **Data Strategy**           | [docs/research/data-collection/README.md](docs/research/data-collection/README.md)                                     | Rationale for three-class design, sampling parameters                  |
| **Fire Scenarios**          | [docs/research/data-collection/fire.md](docs/research/data-collection/fire.md)                                         | Fire detection protocol & sensor signatures                            |
| **False Alarm Scenarios**   | [docs/research/data-collection/false_alarm.md](docs/research/data-collection/false_alarm.md)                           | Cooking, steam, cleaning scenarios                                     |
| **No Fire Baseline**        | [docs/research/data-collection/no_fire.md](docs/research/data-collection/no_fire.md)                                   | Normal operation, environmental variance                               |
| **Collection Checklist**    | [docs/research/data-collection/checklist.md](docs/research/data-collection/checklist.md)                               | Pre-collection safety & equipment verification                         |
| **Sampling & Format**       | [docs/research/data-collection/sampling-and-format.md](docs/research/data-collection/sampling-and-format.md)           | CSV structure, sensor calibration details                              |
| **Storage & Validation**    | [docs/research/data-collection/storage-and-validation.md](docs/research/data-collection/storage-and-validation.md)     | Data integrity, backup, version control                                |
| **Firmware Main**           | [firmware/main/fire-detection-main/fire-detection-main.ino](firmware/main/fire-detection-main/fire-detection-main.ino) | Production sensor integration & logging code                           |
| **Sensor Verification**     | [firmware/diagnostics/verify_all_sensors_operational.ino](firmware/diagnostics/verify_all_sensors_operational.ino)     | Hardware diagnostics & health checks                                   |
| **Sensor Examples**         | [firmware/examples/](firmware/examples/)                                                                               | Individual sensor test sketches (flame, smoke, VOC, CO, temp/humidity) |
| **Logger Tool**             | [tools/legacy/logger-py/](tools/legacy/logger-py/)                                                                     | Serial data capture & CSV export                                       |
| **Data Collection Script**  | [tools/collection/automated_data_collection.sh](tools/collection/automated_data_collection.sh)                         | Automated sampling with timestamps & labels                            |
| **Edge Impulse Upload**     | [tools/integration/upload_to_edge_impulse.sh](tools/integration/upload_to_edge_impulse.sh)                             | API integration for model training platform                            |
| **Arduino Setup**           | [tools/setup/check-edge-impulse-env.sh](tools/setup/check-edge-impulse-env.sh)                                         | Environment validation & USB configuration                             |
| **Thesis Outline**          | [thesis/THESIS_OUTLINE.md](thesis/THESIS_OUTLINE.md)                                                                   | Academic thesis structure (multi-sensor fusion, TinyML)                |
| **Scenario Notes**          | [docs/notes/](docs/notes/)                                                                                             | Specific test scenario analysis (A3, C2)                               |
| **Ubuntu Troubleshooting**  | [docs/troubleshoot/ubuntu-24.04-troubleshoot.md](docs/troubleshoot/ubuntu-24.04-troubleshoot.md)                       | Linux environment issues                                               |
| **Windows Troubleshooting** | [docs/troubleshoot/windows-env-setup-troubleshooting.md](docs/troubleshoot/windows-env-setup-troubleshooting.md)       | Windows setup problems & solutions                                     |

---

## Key Directories

```
firmware/main/           → Production code (fire-detection-main.ino)
firmware/diagnostics/    → Hardware verification tools
firmware/examples/       → Individual sensor test sketches
data/raw/               → Organized by class: fire/, no_fire/, false_alarm/
tools/collection/       → Data logging automation
tools/integration/      → Edge Impulse API integration
tools/setup/           → Environment configuration
docs/guides/           → User-facing procedures
docs/research/         → Technical & academic content
docs/research/data-collection/  → Detailed collection protocols
```

---

## Testing & Validation

**Manual Testing**:

- Upload `verify_all_sensors_operational.ino` to validate hardware
- Monitor serial output: `cat /dev/ttyACM0` (115200 baud)
- Use `edge-impulse-data-forwarder` for live model validation

**No formal automated test suite** exists; validation is sensor-driven and scenario-based.

---

## Quick Links

- **Arduino IDE**: https://www.arduino.cc/en/software
- **DFRobot Sensor Docs**: https://wiki.dfrobot.com
- **Edge Impulse**: https://edgeimpulse.com
- **Arduino UNO R4 WiFi**: https://docs.arduino.cc/hardware/uno-r4-wifi
- **Renesas RA4M1**: https://www.renesas.com/en
