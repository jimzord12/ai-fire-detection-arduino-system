# Implementation Plan: Repository Redesign

This document outlines the step-by-step migration of the AI Fire Detection System repository to a more structured and professional hierarchy.

## Phase 1: Foundation & Safety (Metadata)
*Goal: Ensure the environment is ready for structural changes and nothing is lost.*

- [ ] **Task 1.1**: Update `.gitignore`.
    - Add/update paths for `firmware/`, `tools/`, and `docs/`.
    - Ensure `data/raw/` is handled correctly (ignoring large CSVs but keeping structure).
- [ ] **Task 1.2**: Commit current state.
    - Run `git add . && git commit -m "chore: save state before repo redesign"` to ensure a rollback point.
- [ ] **Task 1.3**: Path Audit.
    - Verify paths in `GEMINI.md`, `TODO.md`, and `README.md` that will need updating.

## Phase 2: Directory Restructuring (The Move)
*Goal: Establish the new hierarchy and move physical files.*

- [ ] **Task 2.1**: **Firmware Migration**
    - Create: `firmware/main/`, `firmware/diagnostics/`, `firmware/examples/`, `firmware/archive/`.
    - Move: `sketches/fireDetectionSystemV2.ino` → `firmware/main/fire-detection-main.ino`.
    - Move: `sketches/verify_all_sensors_operational.ino` → `firmware/diagnostics/`.
    - Move: `sketches/examples/*` → `firmware/examples/`.
    - Move: `sketches/archive/*` → `firmware/archive/`.
- [ ] **Task 2.2**: **Tools Migration**
    - Create: `tools/collection/`, `tools/integration/`, `tools/setup/`, `tools/legacy/`.
    - Move: `scripts/automated_data_collection/*` → `tools/collection/`.
    - Move: `scripts/upload_to_edge_impulse/*` → `tools/integration/`.
    - Move: `scripts/check-edge-impulse-env/*` and `scripts/connect-arduino/*` → `tools/setup/`.
    - Move: `logger/*` → `tools/legacy/logger-py/`.
- [ ] **Task 2.3**: **Documentation Migration**
    - Create: `docs/guides/`, `docs/research/`, `docs/hardware/`, `docs/templates/`.
    - Move: `super-guide.md`, `DAY-TO-DAY-SETUP.md` → `docs/guides/`.
    - Move: `notes/*` → `docs/research/`.
    - Move: `contexts/tpyst/*` → `docs/templates/typst/`.
    - Move: `assets/images/*` → `docs/assets/`.
- [ ] **Task 2.4**: **Data Migration**
    - Create: `data/raw/`.
    - Move: `data/no_fire/`, `data/single-sensor-data/` → `data/raw/`.
    - Keep: `data/strategy.md` and `data/DATA_COLLECTION_GUIDE.md` in `data/`.

## Phase 3: Refactoring & Path Alignment
*Goal: Update scripts and code to work with the new structure.*

- [ ] **Task 3.1**: Update `tools/collection/automated_data_collection.sh`.
    - Change `DATA_DIR` from `../../data/` to `../../data/raw/`.
- [ ] **Task 3.2**: Update `tools/integration/upload_to_edge_impulse.sh`.
    - Update directory lookup to `../../data/raw/`.
- [ ] **Task 3.3**: Update `firmware/main/fire-detection-main.ino`.
    - Verify `#include` paths if any local headers were moved.
- [ ] **Task 3.4**: Clean up `tools/setup/check-edge-impulse-env.sh`.
    - Update internal references to script locations.

## Phase 4: Documentation Update
*Goal: Ensure all internal links and instructions are accurate.*

- [ ] **Task 4.1**: Global path update in Markdown files.
    - Replace `scripts/` with `tools/`.
    - Replace `sketches/` with `firmware/`.
    - Replace `notes/` with `docs/research/`.
- [ ] **Task 4.2**: Update Root `README.md`.
    - Reflect new directory structure in the "Key Directories" section.
- [ ] **Task 4.3**: Update `docs/guides/DAY-TO-DAY-SETUP.md`.
    - Update paths for the environment checker and connection scripts.

## Phase 5: Validation & Cleanup
*Goal: Final test of the system and removal of empty artifacts.*

- [ ] **Task 5.1**: Validate Environment.
    - Run `tools/setup/check-edge-impulse-env.sh`.
- [ ] **Task 5.2**: Validate Firmware.
    - Compile `firmware/main/fire-detection-main.ino` in Arduino IDE.
- [ ] **Task 5.3**: Validate Data Flow.
    - Run a 5-sample test with `tools/collection/automated_data_collection.sh`.
- [ ] **Task 5.4**: Final Cleanup.
    - Remove empty directories: `sketches/`, `scripts/`, `notes/`, `logger/`, `contexts/`, `assets/`.
