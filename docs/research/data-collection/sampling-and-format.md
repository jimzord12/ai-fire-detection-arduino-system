# Sampling & Data Format

## Sampling Parameters

| Parameter                    | Value                    | Justification                                                                                  |
| ---------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Sampling Rate**            | 10 Hz (100 ms intervals) | Optimal for slow-moving sensors (temperature, humidity) while capturing flame flicker dynamics |
| **Sample Duration**          | 10 seconds per file      | Allows temporal correlation; manageable file size; sufficient for feature extraction           |
| **Total Duration per Class** | 15 minutes (90 samples)  | Empirical starting point from Edge Impulse best practices; baseline for classifier convergence |

## Temporal Considerations

- **Time-of-day variance**: Collect `no_fire` data across morning, afternoon, and evening to capture natural circadian temperature/humidity variations
- **Environmental transients**: Capture rapid state changes (e.g., AC startup, door opening) to improve model robustness
- **Stability windows**: Ensure 2–3 seconds of stable sensor readings before triggering sample capture to avoid edge artifacts

## CSV Format

All data is transmitted in CSV format expected by Edge Impulse.

**CSV Columns:** `timestamp, smoke, voc, co, flame, temperature, humidity`

Example:

```
timestamp,smoke,voc,co,flame,temperature,humidity
1674091200000,423.5,512,28.3,45.2,25.0,15.0
1674091200100,425.1,518,28.4,45.3,25.1,15.2
...
```

Key constraints:

- Raw sensor values (no normalization on device)
- Values are floating-point for precision
- One row per 100 ms sample
- No header row in CSV stream (header is added by the Data Forwarder or scripts)
