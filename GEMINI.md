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

## Data Analysis Insights

Key findings from the multi-sensor fusion analysis (v1.0):

-   **High Separability**: Fire, no-fire, and false alarm (steam, cooking, sprays) classes demonstrate high mathematical separability in the current feature space. **Note**: This is a baseline result achieved in controlled laboratory conditions; real-world performance may vary due to environmental noise and sensor aging.
-   **The CO "Truth Sensor"**: CO levels are the most reliable differentiator for active combustion. Spray/steam scenarios exhibit high VOC/Smoke but negligible CO spikes.
-   **The Heat Paradox**: False alarms (steam/cooking) often show higher temperature spikes than early-stage fires, making simple heat-based detection unreliable compared to sensor fusion.
-   **Feature Importance**: Smoke (~33%) and VOC (~18%) are primary indicators, while Humidity (~3%) provides the least unique information.

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

### Thesis Compilation

After making changes to any `.typ` files, run the compilation script to update the PDF:

```bash
# Using Bash
./tools/typst/compile.sh

# Using PowerShell
.\tools\typst\compile.ps1
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

## Academic Standards

### 1. Source Integrity
-   **No Hobbyist Sources**: Technical claims must be supported by peer-reviewed academic literature (e.g., IEEE, ACM, Elsevier, Springer). YouTube videos, blogs, and "expert network" posts are prohibited for primary documentation.
-   **Verification**: Use the `verify-references.ts` tool in `.gemini/v1/cli-tools` to validate bibliography entries.

### 2. Scientific Humility
-   **Classification Accuracy**: Frame high performance (e.g., 100% accuracy) as a "baseline feasibility result in controlled conditions." Avoid definitive claims of perfection.
-   **Error Awareness**: Explicitly document failure modes, sensor drift, and compound interference scenarios.
-   **Safety-Critical Validation**: Prioritize longitudinal analysis and noise-injection testing as essential future work for any life-safety system.

---

## Pragmatic Collaboration & Communication

To maintain high academic and technical standards, agents must adhere to the following collaboration protocol:

1. **Accuracy Over Autonomy**: Prioritize technical and academic accuracy over autonomous completion. Never "fill in" missing data (e.g., bibliographic authors, technical specifications) with placeholders or generic information.
2. **Stop and Ask**: If a task requires information that is not available in the current context or cannot be retrieved autonomously with high confidence, **stop and ask the user**.
3. **Transparent Limitations**: Be explicit about what you can and cannot do. If a request is partially outside your capabilities, fulfill the possible parts and clearly state the requirements for the rest.
4. **Pragmatic Workflow**: Focus on practical, usable results. Avoid conversational filler and prioritize high-signal communication that directly advances the project goals.

---

## Document Index

| Document | Path | Purpose |
| --- | --- | --- |
| **Project README** | [README.md](README.md) | Project overview, component inventory, setup |
| **Task List** | [TODO.md](TODO.md) | Active tasks, thesis migration, data analysis |
| **Agent Guidelines** | [GEMINI.md](GEMINI.md) | **This file.** Build commands, code style, and project structure reference for the AI agent. |
| **Thesis Agent Guide** | [thesis/GEMINI.md](thesis/GEMINI.md) | Agent guidelines specifically for interacting with the `thesis` directory and Typst workflow. |
| **Typst Agent Guide** | [thesis/typst/GEMINI.md](thesis/typst/GEMINI.md) | Agent guidelines for the Typst-based thesis writing environment. |
| **Super Guide** | [docs/guides/super-guide.md](docs/guides/super-guide.md) | Comprehensive end-to-end setup & operation |
| **Day-to-Day Setup** | [docs/guides/DAY-TO-DAY-SETUP.md](docs/guides/DAY-TO-DAY-SETUP.md) | Quick startup procedures & troubleshooting |
| **Data Collection Guide** | [data/DATA_COLLECTION_GUIDE.md](data/DATA_COLLECTION_GUIDE.md) | Practical data capture procedures |
| **Data Analysis Report** | [data/analysis/DATA_ANALYSIS_REPORT.md](data/analysis/DATA_ANALYSIS_REPORT.md) | Statistical analysis, sensor correlations, and ML separability |
| **Analysis Results** | [data/analysis/analysis_results.json](data/analysis/analysis_results.json) | Raw metrics, feature importance, and classification stats |
| **Data Strategy** | [docs/research/data-collection/README.md](docs/research/data-collection/README.md) | Rationale for three-class design, sampling parameters |
| **Firmware Main** | [firmware/main/fire-detection-main/fire-detection-main.ino](firmware/main/fire-detection-main/fire-detection-main.ino) | Production sensor integration & logging code |
| **Sensor Verification** | [firmware/diagnostics/verify_all_sensors_operational.ino](firmware/diagnostics/verify_all_sensors_operational.ino) | Hardware diagnostics & health checks |
| **Logger Tool** | [tools/legacy/logger-py/](tools/legacy/logger-py) | Serial data capture & CSV export |
| **Data Collection Script** | [tools/collection/automated_data_collection.sh](tools/collection/automated_data_collection.sh) | Automated sampling with timestamps & labels |
| **Thesis Outline** | [thesis/THESIS_OUTLINE.md](thesis/THESIS_OUTLINE.md) | Academic thesis structure (multi-sensor fusion, TinyML) |
| **Thesis Progress** | [thesis/THESIS_PROGRESS.md](thesis/THESIS_PROGRESS.md) | Tracking the completion status of thesis sections. |
| **Typst Master File** | [thesis/typst/main.typ](thesis/typst/main.typ) | The main Typst file that assembles the entire thesis. |

---

## Key Directories

```
.
├── data/
│   ├── analysis/     # Scripts and reports for data analysis
│   ├── notebooks/    # Jupyter notebooks for exploratory data analysis
│   └── raw/          # Raw, unprocessed sensor data logs
├── docs/
│   ├── guides/       # User-facing procedures and setup guides
│   └── research/     # Technical & academic content
├── firmware/
│   ├── diagnostics/  # Hardware verification tools
│   ├── examples/     # Individual sensor test sketches
│   └── main/         # Production firmware
├── thesis/
│   ├── assets/       # Figures and images for the thesis
│   ├── literature/   # Literature review materials
│   └── typst/        # Typst source files for the thesis
│       ├── chapters/ # Modular chapter files
│       └── common/   # Common templates and glossary
└── tools/
    ├── collection/   # Data logging automation
    ├── generation/   # Synthetic data generation
    ├── integration/  # Edge Impulse API integration
    └── setup/        # Environment configuration scripts
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
