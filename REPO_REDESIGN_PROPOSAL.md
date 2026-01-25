# Repository Re-design Proposal: AI Fire Detection System

## 1. Current State Analysis
The repository currently suffers from several organizational issues:
- **Redundancy**: Multiple scripts and documentation files covering similar ground.
- **Inconsistency**: Discrepancies between firmware output and helper scripts (e.g., `logger.py`).
- **Fragmentation**: Scripts and tools are spread across `scripts/`, `logger/`, and root.
- **Deep Nesting**: `scripts/` subdirectories are overly complex for small utilities.
- **Vague Naming**: Directory names like `notes/` and `contexts/` don't clearly describe their purpose.

## 2. Proposed Structure
The goal is to align the repository with standard embedded/ML project structures, making it easier for both humans and AI agents to navigate.

```text
ai-fire-detection-system/
├── firmware/                 # All Arduino-related code
│   ├── main/                 # Production firmware (formerly fireDetectionSystemV2)
│   ├── diagnostics/          # Hardware verification tools
│   ├── examples/             # Individual sensor test sketches
│   └── archive/              # Older versions
├── data/                     # Dataset management
│   ├── raw/                  # Scenario-based CSV captures
│   │   ├── fire/
│   │   ├── no_fire/
│   │   └── false_alarm/
│   ├── experiments/          # Single-sensor validation data
│   └── strategy.md           # Data collection protocols
├── tools/                    # Utility scripts and helper applications
│   ├── collection/           # Data logging and automation scripts
│   ├── integration/          # Edge Impulse upload and API tools
│   ├── setup/                # Environment and USB configuration
│   └── legacy/               # Deprecated tools (e.g., unused logger.py)
├── docs/                     # Project documentation
│   ├── setup/                # Environment setup and troubleshooting
│   ├── research/             # Academic notes and strategy discussions
│   ├── hardware/             # Wiring diagrams and sensor specs
│   └── guides/               # Comprehensive guides (Super Guide, Day-to-Day)
├── thesis/                   # Academic writing (To be moved to dedicated repo)
├── .gemini/                  # Agent-specific configurations
├── README.md                 # Entry point
└── TODO.md                   # Task tracking
```

## 3. Key Changes

### 3.1 Firmware Consolidation
- Rename `sketches/` to `firmware/`.
- Rename `fireDetectionSystemV2.ino` to `fire-detection-main.ino` for clarity.
- Ensure all firmware follows a consistent coding standard (as seen in V2).

### 3.2 Tool Centralization
- Move `scripts/*` into `tools/`.
- Flat structure for `tools/` categories instead of individual READMEs per script.
- Move `logger/` to `tools/legacy/` if it remains unused, or refactor it to match the current firmware output format.

### 3.3 Documentation Restructuring
- Create a `docs/` directory to house everything currently in `notes/`, `contexts/`, and the large markdown files in root.
- Move `DAY-TO-DAY-SETUP.md` and `super-guide.md` to `docs/guides/`.
- Maintain a slim root directory.

### 3.4 Data Organization
- Move `strategy.md` and `DATA_COLLECTION_GUIDE.md` into `data/`.
- Enforce the `fire`, `no_fire`, `false_alarm` top-level labels in `data/raw/`.

## 4. Implementation Plan

### Phase 1: Preparation (Metadata)
1. Update `.gitignore` to reflect new paths.
2. Update paths in `TODO.md` and `GEMINI.md`.

### Phase 2: Structural Move
1. Create new directories: `firmware/`, `tools/`, `docs/`, `data/raw/`.
2. Move files according to the proposed structure.
3. Remove empty or redundant directories.

### Phase 3: Script & Path Fixes
1. Update `automated_data_collection.sh` to point to the new `data/raw/` path.
2. Update `upload_to_edge_impulse.sh` to match the new structure.
3. Update `super-guide.md` and `DAY-TO-DAY-SETUP.md` internal links.

### Phase 4: Validation
1. Run `check-edge-impulse-env.sh` (new location).
2. Verify Arduino compilation from the new path.
3. Perform a test data collection run.

## 5. Benefits
- **Better Onboarding**: New developers (or agents) can quickly find the "Source of Truth".
- **Scalability**: Adding new sensors or data collection methods becomes straightforward.
- **Professionalism**: Standardized structure reflects a well-engineered project suitable for a thesis.
