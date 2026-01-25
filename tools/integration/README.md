# Upload to Edge Impulse

## Description
This script simplifies the process of uploading collected CSV data files to the Edge Impulse ingestion API.

## Usage
```bash
./upload_to_edge_impulse.sh <label> [scenario] [category]
```

### Arguments
- `label`: The label of the data to upload (e.g., `fire`, `no_fire`).
- `scenario` (Optional): The scenario subdirectory name.
- `category` (Optional): `training` (default) or `testing`.

### Example
```bash
./upload_to_edge_impulse.sh fire
./upload_to_edge_impulse.sh no_fire closed-room testing
```
