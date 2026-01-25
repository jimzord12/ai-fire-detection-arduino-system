# Scripts & Automation

## `tools/collection/automated_data_collection.sh`

Usage:

```bash
tools/collection/automated_data_collection.sh <label> <num_samples> <duration_seconds> [scenario]
```

Notes:

- Defaults serial port to `/dev/ttyACM0` (edit `SERIAL_PORT` if needed)
- Adds header `timestamp,smoke,voc,co,flame,temperature,humidity` when saving CSVs (matches firmware output order)
- Filters malformed lines; removes empty files; 2 s pause between samples

**CSV Columns:** `timestamp, smoke, voc, co, flame, temperature, humidity`

## `tools/integration/upload_to_edge_impulse.sh`

Usage:

```bash
tools/integration/upload_to_edge_impulse.sh <label> [scenario] [category]
```

Notes:

- Requires `edge-impulse-cli` and `edge-impulse-login`
- Validates directories and file counts before upload
- Prompts for confirmation and provides a link to Edge Impulse Studio on success
