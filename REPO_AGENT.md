# Repo Agent Guide (Lightweight)

This file is a **quick orientation** for working in this repository. It is intentionally lightweight.

## What this thesis is about

This repo contains an end-to-end project and thesis for an **autonomous multi-sensor fire detection node**.

Core idea:

- Combine **multi-sensor fusion** and **TinyML** to classify conditions into **three classes**: `fire`, `no_fire`, and `false_alarm`.
- The “false_alarm” class is explicit to reduce nuisance alarms (e.g., steam/cooking/sprays) compared to binary detectors.

Target platform:

- **Arduino UNO R4 WiFi** (Renesas RA4M1 + ESP32-S3 connectivity)
- Sensors: smoke (MEMS), VOC (MEMS), CO (MEMS), IR flame sensor, temperature/humidity

## Main goal

Deliver:

- A working sensing node firmware + data pipeline
- A thesis documenting: motivation, related work, dataset/collection, model and deployment, and evaluation

## Technologies used (writing + project)

Writing:

- **Typst** is the thesis authoring system.
- Thesis sources live under `thesis/typst/` and are composed modularly (main file includes chapters/sections).

Project / implementation:

- Arduino firmware (C++ / Arduino sketches)
- Python tools for logging and analysis
- Scripts for data collection + Edge Impulse integration
- MQTT telemetry in the system design

## Repo layout (where things live)

- `thesis/`
  - `typst/`: the actual thesis source (Typst)
  - `THESIS_OUTLINE.md`: section-by-section scope (source of truth for structure)
  - `THESIS_PROGRESS.md`: writing progress tracking
  - `typst/docs/`: internal docs on Typst workflow/structure
  - `research_agent/`: configs/prompts for an external research agent (alignment only)
  - `thesis_templates/`: simple Markdown drafting templates (section → subsections → References + optional Glossary)

- `firmware/`
  - `main/`: production sketch
  - `diagnostics/`: sensor verification sketches
  - `examples/`: single-sensor demos

- `data/`
  - `raw/`: captured datasets by class/scenario
  - `analysis/`: analysis scripts + reports + notebooks

- `tools/`
  - `collection/`: automated sampling scripts
  - `integration/`: upload scripts (e.g., Edge Impulse)
  - `legacy/logger-py/`: serial logger tooling

- `docs/`
  - guides, troubleshooting, and research notes

## Conventions (minimal)

- Prefer the thesis outline as the scope guardrail: `thesis/THESIS_OUTLINE.md`.
- For thesis writing, keep citations in IEEE style and avoid citing internal repo Markdown as “sources”.
- Keep changes focused (avoid unrelated refactors) and follow existing directory structure.
