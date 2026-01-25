# Project Tools

This directory contains utility scripts for data collection, environment verification, and data management, organized by category.

## Available Tools

### [Collection](./collection/)
`collection/automated_data_collection.sh`
- Automates serial data logging from the Arduino.
- Formats data into CSVs compatible with Edge Impulse in `data/raw/`.

### [Integration](./integration/)
`integration/upload_to_edge_impulse.sh`
- Bulk uploads collected CSV datasets from `data/raw/` to your Edge Impulse project.

### [Setup](./setup/)
`setup/connect-arduino.ps1` (Windows)
- Automates finding and attaching the Arduino to WSL2 using usbipd-win.
`setup/check-edge-impulse-env.sh` (Linux/macOS)
- Verifies that Node.js, Python, Edge Impulse CLI, and Arduino tools are installed.

### [Legacy](./legacy/)
- Contains deprecated or experimental scripts like the older `logger-py` implementation.
