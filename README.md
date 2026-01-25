# AI Fire Detection System Using Arduino UNO R4 WiFi

This project utilizes the Arduino UNO R4 WiFi microcontroller in conjunction with various DFRobot sensors to create an AI-powered fire detection system. The system leverages the HuskyLens AI Machine Vision Sensor for real-time object recognition and tracking, alongside multiple environmental sensors to monitor smoke, flame, VOCs, CO levels, temperature, and humidity.

## Project Structure

```text
ai-fire-detection-system/
├── firmware/                 # All Arduino-related code
│   ├── main/                 # Production firmware (fire-detection-main.ino)
│   ├── diagnostics/          # Hardware verification tools
│   ├── examples/             # Individual sensor test sketches
│   └── archive/              # Older versions
├── data/                     # Dataset management
│   ├── raw/                  # Scenario-based CSV captures (fire, no_fire, false_alarm)
│   ├── strategy.md           # Data collection protocols
│   └── DATA_COLLECTION_GUIDE.md
├── tools/                    # Utility scripts and helper applications
│   ├── collection/           # Data logging and automation scripts
│   ├── integration/          # Edge Impulse upload and API tools
│   └── setup/                # Environment and USB configuration
├── docs/                     # Project documentation
│   ├── guides/               # Comprehensive guides (Super Guide, Day-to-Day)
│   ├── research/             # Academic notes and strategy discussions
│   ├── hardware/             # Wiring diagrams and sensor specs
│   └── assets/               # Documentation images
├── thesis/                   # Academic writing
└── README.md                 # Project entry point
```

## Setup and Configuration

1. **Arduino IDE Installation**: Ensure you have the latest version of the Arduino IDE installed on your computer. You can download it from the [official Arduino website](https://www.arduino.cc/en/software).

2. **Library Installation**: Install the necessary libraries for the sensors used in this project. You can find these libraries in the Arduino Library Manager or download them from the DFRobot GitHub repository.

## Project Component Inventory

Based on the provided image, the following electronic components and sensors are present:

### Microcontroller

| Model/ID                | Component Name      | Description                                                                                               |
| :---------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Arduino UNO R4 WiFi** | Arduino UNO R4 WiFi | Microcontroller board featuring the Renesas RA4M1 and ESP32-S3 for WiFi/Bluetooth connectivity [image:1]. |

### Sensors (DFRobot)

| Model/ID    | Component Name                              | Description                                                                          |
| :---------- | :------------------------------------------ | :----------------------------------------------------------------------------------- |
| **SEN0570** | Fermion: MEMS Smoke Sensor                  | Module designed for smoke detection in fire alarm systems [web:2].                   |
| **DFR0076** | Flame Sensor                                | IR sensor used to detect fire sources or light in the 760nm-1100nm range [web:7].    |
| **SEN0566** | Fermion: MEMS VOC Sensor                    | Gas sensor for detecting Volatile Organic Compounds (VOCs) in the air [web:8].       |
| **SEN0564** | Fermion: MEMS CO Sensor                     | Sensor specifically designed for detecting Carbon Monoxide levels [web:9].           |
| **SEN0527** | Fermion: MEMS Temperature & Humidity Sensor | Environmental sensor for precise ambient temperature and humidity readings [web:10]. |

### Prototyping Accessories

| Model/ID       | Component Name              | Description                                                                           |
| :------------- | :-------------------------- | :------------------------------------------------------------------------------------ |
| **Generic**    | Solderless Breadboard       | White breadboard for solderless circuit prototyping [image:1].                        |
| **PRD-001298** | Devebox Resistor Kit (Lite) | Assorted resistors including 220R, 470R, 1K, 4.7K, and 10K values [image:1].          |
| **Generic**    | Jumper Wires                | Multiple bundles of multicolored jumper wires for breadboard connections [image:1].   |
| **Generic**    | Trimpot Potentiometers      | Set of blue variable resistors (trimmer potentiometers) for circuit tuning [image:1]. |
