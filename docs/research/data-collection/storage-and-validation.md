# Storage, File Naming & Validation

## File Naming

```
[Date]_[Class]_[Scenario]_[Run].csv
```

Examples:

- `2025-01-15_fire_close_low_vent_001.csv`
- `2025-01-15_no_fire_baseline_am_001.csv`
- `2025-01-15_false_alarm_cooking_001.csv`

**CSV Columns (required):** `timestamp, smoke, voc, co, flame, temperature, humidity`

## Metadata Log

Keep a spreadsheet with:

- Date/time, class, scenario
- Environmental conditions (temp, humidity, ventilation)
- Sensor calibration notes
- Any anomalies or issues

## Dataset Summary & Training Notes

- 15 minutes per class (~90 samples) recommended
- Train/test split: 80/20 stratified by scenario
- DSP blocks: spectral features for flame and smoke; raw for slow-moving sensors
- Target: ≥90% test accuracy; <5% false positive rate on `no_fire`+`false_alarm` combined
