# AI Fire Detection Arduino System - Agent Guidelines

This document provides build, test, and code style guidelines for agents working on this repository.

---

## Build, Lint, and Test Commands

### Python (logger/)
```bash
# Linting
cd logger && ruff check .
cd logger && ruff format .

# Run Python script (serial data logger)
cd logger && python logger.py

# Install dependencies (if ruff is not installed)
cd logger && pip install ruff pyserial
```

### Arduino (firmware/)
```bash
# Build/compile sketch (requires Arduino CLI)
arduino-cli compile --fqbn arduino:renesas_uno:arduino_uno_r4_wifi firmware/fireDetectionSystemV2.ino

# Upload sketch to Arduino
arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:renesas_uno:arduino_uno_r4_wifi firmware/fireDetectionSystemV2.ino

# Or use Arduino IDE 2.x to compile/upload sketches
```

### Shell Scripts
```bash
# Run automated data collection
./tools/collection/automated_data_collection.sh <label> <num_samples> <duration> [scenario]

# Upload data to Edge Impulse
./tools/integration/upload_to_edge_impulse.sh <label> [scenario]

# Environment check
./tools/setup/check-edge-impulse-env.sh
```

### Testing
No formal test suite exists. Manual testing is done via:
- Uploading `verify_all_sensors_operational.ino` to test hardware
- Running `cat /dev/ttyACM0` to verify serial data output
- Using `edge-impulse-data-forwarder` for live data validation

---

## Code Style Guidelines

### Python (logger/)

**Imports**
- Standard library imports first, then third-party imports
- Sort alphabetically within each group
```python
import csv
import re
import sys
import time

import serial
from serial.serialutil import SerialException
```

**Type Hints**
- Use modern Python 3.13+ syntax (PEP 695 union types)
```python
def _parse_row(line: str) -> list[str] | None:
    pass

def _preflight_check(ser: serial.Serial) -> tuple[bool, str]:
    pass
```

**Naming Conventions**
- Functions: `snake_case`
- Private functions: prefix with underscore `_parse_row()`
- Variables: `snake_case`
- Constants: `UPPER_CASE`
- Classes: `PascalCase`

**Error Handling**
- Use specific exception handling (`SerialException`)
- Use broad exception handling for non-critical paths with comments
- Exit with meaningful error codes (`raise SystemExit(1)`)

**Code Structure**
- Configuration dictionary at module level
- Use type hints for all function signatures
- Private helper functions prefixed with underscore
- Main execution logic at module level (or in `main()` function)

**Formatting**
- Use `ruff format` for consistent formatting
- 4-space indentation
- Maximum line length: 100 characters (ruff default)
- Use f-strings for string formatting

---

### Arduino (firmware/)

**Includes**
- Place Arduino includes first, then library includes
```cpp
#include <Arduino.h>
#include <Wire.h>
#include "DFRobot_AHT20.h"
```

**Naming Conventions**
- Classes: `PascalCase`
- Functions: `camelCase`
- Variables: `camelCase`
- Private members: prefix with underscore `_aht`, `_sampleInterval`
- Constants: `UPPER_CASE_WITH_UNDERSCORES`
- Enums: `PascalCase` with `enum class`

**Modern C++ Features**
- Use `enum class` instead of plain enums
- Use range-based for loops
- Use `const` for constants
- Use references for function parameters (`const SensorConfig& cfg`)
```cpp
for (const auto& sensor : SENSOR_MAP) {
    // Process sensor
}
```

**Data Structures**
- Use `struct` for plain data containers
- Use `class` for objects with methods
- Use arrays for compile-time configuration
```cpp
struct SensorConfig {
    const char* name;
    SensorType type;
    int pinSDA;
    int pinSCL;
    float threshold1;
    float threshold2;
};
```

**Comments**
- Use `//` for single-line comments
- Use `/** */` for block comments and documentation
- Add brief descriptions above functions
```cpp
/**
 * @brief Sensor Configuration & Logic
 * Optimized for Renesas RA4M1 (Arduino UNO R4)
 */
```

**Code Organization**
- Configuration section at top (constants, enums, structs)
- Main class with private/public sections
- `setup()` and `loop()` at bottom
- Global variables minimized (use class encapsulation)

**Serial Communication**
- Standard baud rate: 115200
- Data format: CSV without spaces, newline terminated
- Sampling rate: 10Hz (100ms intervals)
```cpp
Serial.print(smoke);
Serial.print(",");
Serial.print(flame);
Serial.println(); // End row
```

---

## Project-Specific Conventions

### Data Format
- Serial output: `smoke,flame,temp,hum,voc,co` (comma-separated, no spaces)
- Timestamp format: milliseconds since reset (`unsigned long`)
- CSV files must have header row with timestamp for Edge Impulse

### Hardware Configuration
- Target board: Arduino UNO R4 WiFi (Renesas RA4M1)
- Sensor mapping defined in `SENSOR_MAP[]` array
- I2C pins: A4 (SDA), A5 (SCL)
- Analog pins: A0-A3 for sensors

### File Structure
- `firmware/`: Arduino firmware (`.ino` files)
- `logger/`: Python data collection tools
- `scripts/`: Automation shell scripts
- `data/`: Collected sensor datasets
- `contexts/`: Typst type system definitions

### Development Environment
- Primary platform: Linux (native or WSL2)
- Arduino IDE 2.x for Arduino development
- Python 3.13+ for Python tools
- Edge Impulse CLI for ML model deployment

---

## Notes for Agents

- No formal unit tests exist - verify functionality manually with hardware
- When adding new sensors, update `SENSOR_MAP[]` array
- Always maintain CSV format for Edge Impulse compatibility
- Use ruff for Python linting and formatting
- Follow Arduino best practices for memory management (avoid dynamic allocation)
- Check `docs/guides/DAY-TO-DAY-SETUP.md` for daily workflow procedures
- Refer to `docs/guides/super-guide.md` for detailed hardware and software documentation
