# PROJECT_PRACTICAL_DIR_INDEX

This document provides a structured index of directories and files relevant for practical information extraction for the thesis.

## 1. data/

This directory contains all raw and processed sensor data, analysis scripts, and figures generated from the data.

-   **`data/analysis/`**: Contains scripts for data analysis, aggregated data, and reports on the analysis.
    -   `aggregated_data.csv`: Consolidated sensor data for analysis.
    -   `analysis_results.json`: JSON output of statistical analysis and feature importance.
    -   `DATA_ANALYSIS_REPORT.md`: Markdown report summarizing key findings from data analysis.
    -   `explore_data.py`: Script for exploratory data analysis.
    -   `generate_report_data.py`: Script to generate data for the analysis report.
    -   `save_figures.py`: Script to save figures generated during analysis.
    -   `sensor_distributions.png`: Visualizations of sensor data distributions.
-   **`data/archive/`**: Stores older or archived sensor data, often organized by single sensor experiments.
    -   `data/archive/flame/night/`: Archived flame sensor data collected at night.
    -   `data/archive/single-sensor-data/co/`: CO sensor data from single-sensor experiments.
        -   `data/archive/single-sensor-data/co/after-long-warmup/`: CO data after a long sensor warmup.
            -   `closed-small-room/`: CO data in a closed small room under various conditions (e.g., 9-tealights.csv).
            -   `open-small-room/`: CO data in an open small room.
    -   `data/archive/single-sensor-data/flame/`: Flame sensor data from single-sensor experiments.
        -   `data/archive/single-sensor-data/flame/day/`: Flame data collected during the day.
            -   `1-candle/`, `3-candles/`, `6-candles/`: Flame data with varying numbers of candles at different distances.
    -   `data/archive/single-sensor-data/smoke/`: Smoke sensor data from single-sensor experiments.
        -   `data/archive/single-sensor-data/smoke/after-long-warmup/`: Smoke data after a long sensor warmup under different conditions.
    -   `data/archive/single-sensor-data/t_h/`: Temperature and Humidity sensor data.
    -   `data/archive/single-sensor-data/voc/`: VOC sensor data from single-sensor experiments.
        -   `data/archive/single-sensor-data/voc/after-long-warmup/`: VOC data after a long sensor warmup under different conditions.
        -   `data/archive/single-sensor-data/voc/before-long-warmup/`: VOC data before a long sensor warmup under different conditions.
-   **`data/figures/`**: Contains various figures and plots generated from data analysis.
    -   `class_distribution.png`: Plot showing the distribution of data classes.
    -   `confusion_matrix.png`: Confusion matrix of the ML model performance.
    -   `feature_importance.png`: Plot indicating the importance of different sensor features.
    -   `sensor_boxplots.png`: Box plots for sensor readings.
    -   `sensor_correlation.png`: Heatmap showing correlations between sensor readings.
-   **`data/notebooks/`**: Jupyter notebooks used for exploratory data analysis and reporting.
    -   `data_analysis.ipynb`: Main Jupyter notebook for data analysis.
    -   `data_analysis_report.html`: HTML export of the data analysis notebook.
-   **`data/raw/`**: Stores raw, unprocessed sensor data logs, organized by class (false_alarm, fire, no_fire) and scenario.
    -   `data/raw/false_alarm/`: Raw data for false alarm scenarios (cooking, spray, steam).
    -   `data/raw/fire/`: Raw data for fire scenarios (close_low_vent, medium_normal_vent, smoldering).
    -   `data/raw/no_fire/`: Raw data for no-fire scenarios (base_room_air, closed_room, hvac_transient, open_space).

## 2. firmware/

This directory contains all Arduino firmware code, including diagnostic tools, examples, and the main production code.

-   **`firmware/archive/`**: Older versions of the firmware.
    -   `fireDetectionSystemV1.ino`, `fireDetectionSystemV2.ino`: Archived firmware versions.
-   **`firmware/diagnostics/`**: Firmware for hardware diagnostics and sensor verification.
    -   `verify_all_sensors_operational.ino`: Sketch to verify the operational status of all connected sensors.
-   **`firmware/examples/`**: Example sketches for individual sensors.
    -   `analog_flame_sensor.ino`: Example code for the analog flame sensor.
    -   `analog_smoke_sensor.ino`: Example code for the analog smoke sensor.
    -   `analog_voc_sensor.ino`: Example code for the analog VOC sensor.
    -   `temp_humidity_sensor.ino`: Example code for the temperature and humidity sensor.
-   **`firmware/main/fire-detection-main/`**: The main production firmware for the fire detection system.
    -   `fire-detection-main.ino`: The primary Arduino sketch implementing the multi-sensor fire detection logic.

## 3. docs/

This directory contains various documentation, guides, research notes, and troubleshooting information.

-   **`docs/artifacts/`**: Generated documentation artifacts.
    -   `fire-detection-main.md`: Markdown documentation generated from the main firmware.
-   **`docs/guides/`**: User-facing procedures and setup guides.
    -   `DATA_COLLECTION_GUIDE.md`: Guide for practical sensor data collection procedures.
    -   `DAY-TO-DAY-SETUP.md`: Quick startup procedures and troubleshooting for daily use.
    -   `from-data-to-tinyml-model.md`: Documentation on the pipeline from raw data to TinyML model.
    -   `super-guide.md`: Comprehensive end-to-end setup and operation guide.
-   **`docs/notes/`**: Miscellaneous research notes on specific scenarios.
    -   `scenario-a3.md`, `scenario-c2.md`: Notes on specific experimental scenarios.
-   **`docs/research/`**: Technical and academic content, research strategies, and platform-specific documentation.
    -   `AGENTS.md`, `automated-data-collection.md`, `firmware-notes.md`, `ml-model-arduino-deployment.md`: Various research-related markdown files.
    -   `docs/research/data-collection/`: Detailed documentation on data collection strategy.
        -   `README.md`: Overview of the data collection strategy.
        -   `procedure.md`: Step-by-step data collection procedure.
        -   `sampling-and-format.md`: Details on sampling rates and data format.
    -   `docs/research/discussion-section/`: Notes and ideas for the thesis discussion section.
    -   `docs/research/edge-impulse-platform/`: Documentation related to using the Edge Impulse platform.
        -   `001-data-acquisition.md` to `006-deployment-build-lib.md`: Step-by-step documentation of the Edge Impulse workflow.
-   **`docs/troubleshoot/`**: Troubleshooting guides for different operating systems.
    -   `ubuntu-24.04-troubleshoot.md`, `windows-env-setup-troubleshooting.md`: OS-specific troubleshooting guides.

## 4. tools/

This directory contains various scripts and utilities for data collection, generation, integration, setup, and Typst-related tasks.

-   **`tools/collection/`**: Scripts for automating data logging and collection.
    -   `automated_data_collection.sh`: Bash script for automated sampling with timestamps and labels.
-   **`tools/generation/`**: Scripts for synthetic data generation.
    -   `generate-spray-data.ts`: TypeScript script to generate synthetic spray data.
-   **`tools/integration/`**: Scripts for integrating with external platforms like Edge Impulse.
    -   `upload_all_to_edge_impulse.sh`, `upload_to_edge_impulse.sh`: Scripts to upload data to Edge Impulse.
-   **`tools/legacy/logger-py/`**: Python-based serial data logger and CSV exporter.
    -   `logger.py`, `main.py`: Python scripts for logging serial data.
    -   `voc_data.csv`: Example VOC data from logging.
-   **`tools/setup/`**: Scripts for environment configuration and hardware connection.
    -   `check-edge-impulse-env.sh`, `check-edge-impulse-env.ps1`: Scripts to check Edge Impulse environment setup.
    -   `connect-arduino.ps1`: PowerShell script to connect to Arduino.
-   **`tools/typst/utils/`**: Utilities for Typst-related tasks.
    -   `sync-bib.sh`: Script to synchronize bibliography files.
-   **`tools/utils/`**: General utility scripts.
    -   `sync-bib.sh`: Script to synchronize bibliography files (duplicate of the one in `tools/typst/utils`).

## 5. thesis/assets/

This directory contains assets used in the thesis, primarily figures.

-   **`thesis/assets/figures/data_analysis/`**: Figures specifically generated from data analysis, used in the thesis.
    -   `class_distribution.png`, `confusion_matrix.png`, `feature_importance.png`, `sensor_boxplots.png`, `sensor_correlation.png`: Visual assets for the thesis.
-   **`thesis/assets/figures/edge-impulse/`**: Figures illustrating the Edge Impulse workflow for the thesis.
    -   `001-platform-data-acquisition.png` to `009-platform-deployment.png`: Screenshots and diagrams of the Edge Impulse platform for the thesis.