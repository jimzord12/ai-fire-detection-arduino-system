# Project Scripts

This directory contains utility scripts for data collection, environment verification, and data management.

## Available Scripts

### [Automated Data Collection](./automated_data_collection/)
`automated_data_collection/automated_data_collection.sh`
- Automates serial data logging from the Arduino.
- formats data into CSVs compatible with Edge Impulse.

### [Connect Arduino](./connect-arduino/)
`connect-arduino/connect-arduino.ps1` (Windows)
- Automates finding and attaching the Arduino to WSL2 using usbipd-win.

### [Environment Check](./check-edge-impulse-env/)
`check-edge-impulse-env/check-edge-impulse-env.sh` (Linux/macOS)
`check-edge-impulse-env/check-edge-impulse-env.ps1` (Windows)
- Verifies that Node.js, Python, Edge Impulse CLI, and Arduino tools are installed.

### [Upload to Edge Impulse](./upload_to_edge_impulse/)
`upload_to_edge_impulse/upload_to_edge_impulse.sh`
- Bulk uploads collected CSV datasets to your Edge Impulse project.
