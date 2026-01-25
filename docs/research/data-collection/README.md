# Data Collection Strategy — Overview

This folder contains the split, focused documents for the multi-sensor fire detection data collection strategy.

## Executive summary

This strategy defines a three-class classification approach (`fire`, `no_fire`, `false_alarm`) using sensor fusion from five DFRobot sensors on an Arduino UNO R4 WiFi for TinyML training with Edge Impulse. The goal is to collect representative datasets that reduce false positives while maintaining high true-positive detection rates.

**CSV Columns:** `timestamp, smoke, voc, co, flame, temperature, humidity`

---

## Structure

- `sampling-and-format.md` — Sampling parameters, temporal considerations, and CSV format
- `fire.md` — Scenario descriptions for the `fire` class (A1–A3)
- `no_fire.md` — Scenario descriptions for the `no_fire` class (B1–B3)
- `false_alarm.md` — Scenario descriptions for the `false_alarm` class (C1–C3)
- `procedure.md` — Equipment setup, collection workflow, QA, and automated script usage
- `scripts.md` — Details about `tools/collection/automated_data_collection.sh` and `tools/integration/upload_to_edge_impulse.sh`
- `storage-and-validation.md` — File naming, metadata logging, dataset summary, and evaluation guidance
- `checklist.md` — Short field checklist for collectors
- `appendix.md` — References and extra notes

---

For full details see the linked files in this directory. The original full strategy has been archived to `_archive_strategy.md` in this folder.
