# Automated Data Collection Script

## Description
This script automates the process of collecting sensor data from a serial device (e.g., Arduino) and saving it into CSV format suitable for Edge Impulse.

## Usage
```bash
./automated_data_collection.sh <label> <num_samples> <duration_seconds> [scenario]
```

### Arguments
- `label`: The label for the data (e.g., `no_fire`, `flame`).
- `num_samples`: Number of samples to collect.
- `duration_seconds`: Duration of each sample in seconds.
- `scenario` (Optional): A specific scenario name (e.g., `closed-room`).

### Example
```bash
./automated_data_collection.sh no_fire 100 10
./automated_data_collection.sh flame 50 10 candle-test
```
