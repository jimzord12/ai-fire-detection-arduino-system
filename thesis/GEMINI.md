# Thesis Writing Workflow: Typst & Modular Composition

This document explains the technical setup for the Fire Detection System thesis and how to use the iterative workflow.

## 1. Directory Structure

The `thesis` directory is organized to separate the written content from other project assets.

```
thesis/
├── assets/         # Figures, images, and other assets for the thesis
├── data_analysis/  # Reports and data specific to the thesis
├── literature/     # Literature review materials (PRISMA, extraction tables)
├── prompts/        # Prompts used for AI-assisted writing
├── thesis_templates/ # Templates for chapters, sections, etc.
└── typst/          # Core Typst source files for the thesis
    ├── assets/     # Typst-specific assets (e.g., fonts, logos)
    ├── chapters/   # Modular chapter files, each with its own sections
    ├── common/     # Shared Typst code (e.g., templates, glossary)
    ├── main.typ    # The master Typst document that assembles the thesis
    └── bibliography.bib # Global bibliography for the entire thesis
```

## 2. Why Typst?

We are using **Typst** instead of LaTeX for several reasons:

- **Performance:** Instant incremental compilation (no more waiting for PDFs to render).
- **Simplicity:** A modern, readable syntax that feels like Markdown but has the power of LaTeX.
- **Modularity:** Excellent support for `#include` which powers our "Section-to-Chapter" workflow.

## 3. The Modular Workflow

To allow for iterative development, the thesis is broken down into three tiers:

### Tier 1: Atomic Sections (`sections/`)

Every sub-heading in your outline is a standalone **section folder**.

- Each section folder contains:
  - `content.typ`: The actual Typst content for the section.
  - `references.bib`: Section-local bibliography.
- **Location:** `thesis/typst/chapters/[chapter_name]/sections/[section_id]_[section_name]/`
- **Benefit:** You can focus on writing 500–1000 words at a time without getting lost in a 70-page document.

### Tier 2: Chapter Controllers (`chapter.typ`)

Each chapter folder contains a `chapter.typ` file that acts as a glue layer.

- **Function:** It contains the main Chapter Heading and `#include` statements for each section.
- **Control:** You can comment out a section (using `//`) if you want to temporarily hide it from the final render.

### Tier 3: The Master Document (`main.typ`)

The root file that pulls everything together.

- **Function:** Manages the Title Page, Abstract, Table of Contents, Bibliography, and Global Styles.

---

## 4. How to Write and Preview

### Adding Content

1.  Create or open the section content file:
    `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/content.typ`.
2.  Write your content using Typst syntax.
3.  Ensure the section is included in the chapter's `chapter.typ`.

Optional but recommended:

- Add references for that section in:
  `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/references.bib`.

### Real-time Preview

If you have the Typst CLI installed, run this command in your terminal from the project root:

```bash
typst watch thesis/typst/main.typ
```

This will open/update a PDF every time you save a `.typ` file.

### Citations

For drafting, keep citations **close to the text**:

- Put new entries in the section-local `.bib` file next to your section `.typ`.
- Periodically merge curated entries into the thesis-wide bibliography: `thesis/typst/bibliography.bib`.

In the `.typ` text, cite them using `@key`.
Example: `As discussed by @perez2023tinyml...`

---

## 5. Key Formatting Tips (Robotic Framing)

Per the `WRITING_TIPS.md`, remember to use the specific "Robotic" terminology in your sections:

- **Instead of "Detector":** Use _Autonomous Sensing Node_ or _Edge Intelligence Unit_.
- **Architecture:** Emphasize the _Asymmetric Multi-Processing_ of the Arduino UNO R4 (Renesas + ESP32).

## 6. Progress Tracking

Use `thesis/THESIS_PROGRESS.md` to mark sections as:

- 🔲 **Todo**
- 📝 **Drafting**
- ✅ **Done**

This helps you see the "big picture" while working on tiny, modular pieces.

---

## 7. Reference Verification

All references in the bibliography must be verified for validity and accessibility before final submission.

### How to Run the Tool

```bash
cd .gemini/v1/cli-tools
npx tsx ref-tools/verify-references.ts ../../thesis/typst/bibliography.bib
```

### Understanding the Report

- **Location:** Generated in the same directory as the input file
- **Format:** `{input_basename}-validation-report-{timestamp}.md`
- **Contents:** Summary stats, confidence levels, detailed findings per reference

**Status Icons:**

| Icon | Status      | Description                             |
| ---- | ----------- | --------------------------------------- |
| ✅   | Verified    | High confidence match found in database |
| ⚠️   | Suspicious  | Partial match or title discrepancy      |
| ❌   | Broken Link | URL/DOI unreachable or returns 404      |

### Workflow for Fixing References

1. Review all `broken_link` and `suspicious` entries in the report
2. Find appropriate replacements for invalid DOIs (check Crossref, Semantic Scholar)
3. Ensure all references have either a `doi` or `url` field
4. Delete the previous report before re-running: `rm thesis/typst/bibliography-validation-report-*.md`
5. Re-run the verification tool
6. Repeat until no `broken_link` or `suspicious` entries remain

### Common Issues

- **DOI Not Found** - DOI may be incorrect or not yet registered; verify at https://doi.org
- **Access Denied** - Paywalled or restricted access; try alternative sources
- **HTTP 429** - Rate limited; wait a few minutes and retry

### ⚠️ Author Requirements

> **IMPORTANT:** "Anonymous" author values are **NOT permitted** in the bibliography.
>
> All references must have **identifiable authors**:
>
> - Individual researchers (e.g., "Smith, John")
> - Organizations (e.g., "IEEE Standards Association")
> - Institutions (e.g., "National Fire Protection Association")
>
> If a source has no identifiable author, **replace it with a better source** that has proper attribution. Anonymous sources lack academic credibility and should not be used in the thesis.

---

## 8. Figure and Table Placement Guide

This section documents all figures and tables to be integrated into the thesis, along with their recommended placements and descriptions.

### 8.1 Figure Inventory

**Source File:** [`thesis/assets/figures/IMAGE_DESCRIPTIONS.md`](thesis/assets/figures/IMAGE_DESCRIPTIONS.md)

#### 8.1.1 Data Analysis Figures (`/data_analysis`)

| Figure Filename          | Illustration Purpose                                                        | Recommended Figure Description                                                                                                                                                                                                                                                                           | Recommended Placement                                    |
| :----------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| `class_distribution.png` | Shows the balance of the dataset collected for training.                    | **Figure X: Dataset Class Distribution.** A bar chart representing the number of samples for each of the three target classes: `fire`, `no_fire`, and `false_alarm`. The distribution confirms a well-balanced dataset, preventing model bias.                                                           | Chapter 8, Section 8.2 (Dataset Summary)                 |
| `sensor_correlation.png` | Illustrates the linear relationships between different sensors.             | **Figure X: Sensor Correlation Matrix.** A heatmap showing the Pearson correlation coefficients between the six sensors. Low correlation between certain sensors (e.g., CO and Humidity) indicates they provide unique, non-redundant information for the fusion model.                                  | Chapter 3, Section 3.4 (Feature Engineering)             |
| `sensor_boxplots.png`    | Visualizes the range and signature of each sensor across the three classes. | **Figure X: Sensor Signature Analysis by Class.** Boxplots showing the median, quartiles, and outliers for each sensor across the three classes. This highlights the distinct chemical and thermal signatures of each scenario, such as higher VOC/Smoke in false alarms versus higher CO in real fires. | Chapter 8, Section 8.4 (Ablation Study)                  |
| `confusion_matrix.png`   | Shows the classification performance of the model on the test set.          | **Figure X: Model Confusion Matrix.** A matrix visualizing the predicted vs. actual class labels. The 100% accuracy in this controlled environment demonstrates the mathematical separability of the fire and false alarm classes.                                                                       | Chapter 8, Section 8.3 (Training and Validation Metrics) |
| `feature_importance.png` | Ranks the contribution of each sensor to the final ML decision.             | **Figure X: Feature Importance Ranking.** A bar chart showing the relative importance of each sensor in the classification process. Smoke and VOC are identified as the most significant contributors (~50% combined), while Humidity provides the least unique information.                             | Chapter 8, Section 8.4 (Ablation Study)                  |

#### 8.1.2 Edge Impulse Platform Figures (`/edge-impulse`)

| Figure Filename                            | Illustration Purpose                                               | Recommended Figure Description                                                                                                                                                                                    | Recommended Placement                                    |
| :----------------------------------------- | :----------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| `001-platform-data-acquisition.png`        | Shows the data ingestion interface for raw sensor logs.            | **Figure X: Edge Impulse Data Acquisition Interface.** A screenshot of the platform's data ingestion page, showing the raw time-series data from the multi-sensor array after being uploaded from the Arduino.    | Chapter 7, Section 7.1 (Edge Impulse Project Setup)      |
| `002-platform-create-impulse.png`          | Illustrates the TinyML pipeline (DSP + Learning blocks).           | **Figure X: Impulse Design Architecture.** The Edge Impulse "Create Impulse" screen, showing the configuration of the time-series data block, the Spectral Analysis DSP block, and the Neural Network Classifier. | Chapter 7, Section 7.2 (Impulse Design and DSP Blocks)   |
| `003-platfotm-spectral-features-error.png` | Documents troubleshooting during the DSP configuration phase.      | **Figure X: Spectral Feature Configuration Error.** A screenshot illustrating common errors during DSP block setup, used to discuss the importance of correct window size and FFT parameters for sensor fusion.   | Chapter 7, Section 7.2 (Impulse Design and DSP Blocks)   |
| `004-platfotm-spectral-features.png`       | Shows the successful configuration of the Spectral Analysis block. | **Figure X: Spectral Analysis DSP Configuration.** The final settings for the spectral features, including window length and frequency-domain processing used to extract fire-relevant signatures.                | Chapter 7, Section 7.2 (Impulse Design and DSP Blocks)   |
| `005-platform-feature-explorer.png`        | Visualizes the clustering of features in a 3D explorer.            | **Figure X: 3D Feature Explorer Visualization.** A plot showing how the three classes (fire, no_fire, false_alarm) cluster in the high-dimensional feature space, providing a visual proof of class separability. | Chapter 7, Section 7.2 (Impulse Design and DSP Blocks)   |
| `006-platform-classifier.png`              | Shows the Neural Network training parameters and architecture.     | **Figure X: Classifier Training Configuration.** The training interface in Edge Impulse, detailing the neural network topology, learning rate, and training cycles (epochs) used for the fire detection model.    | Chapter 7, Section 7.3 (Model Architecture and Training) |
| `007-platform-model-testing.png`           | Illustrates the validation of the model on unseen test data.       | **Figure X: Live Model Testing and Validation.** A screenshot of the model testing results within the Edge Impulse platform, showing the classification accuracy on the hold-out test dataset.                    | Chapter 7, Section 7.3 (Model Architecture and Training) |
| `008-platform-deployment-success-msg.png`  | Confirms the successful compilation of the C++ library.            | **Figure X: Model Compilation and Build Success.** The notification screen confirming the successful generation of the optimized C++ library for deployment on the Arduino UNO R4.                                | Chapter 7, Section 7.7 (Quantization Strategy)           |
| `009-platform-deployment.png`              | Shows the deployment options for the Arduino UNO R4.               | **Figure X: Deployment Target Selection.** The deployment page showing the various export options, specifically the selection of the Arduino library for integration into the custom firmware.                    | Chapter 7, Section 7.4 (Arduino Firmware Development)    |

#### 8.1.3 Data Collection Evidence (`/data-collection-evidence`)

| Figure Filename                     | Illustration Purpose                                | Recommended Figure Description                                                                                                                                                 | Recommended Placement                           |
| :---------------------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| `002-flame-source-only-indoors.jpg` | Shows the sensor node capturing indoor flame data.  | **Figure X: Indoor Flame Data Collection.** The sensor node capturing infrared signatures from a cluster of candles, representing the "Fire" class baseline.                   | Chapter 6, Section 6.4 (Fire Class)             |
| `003-flame-smoke-indoors.jpg`       | Captures the combination of flame and smoke.        | **Figure X: Combined Flame and Smoke Capture.** The sensor node capturing data from both candles and a smoldering incense bowl, illustrating a complex fire scenario.          | Chapter 6, Section 6.4 (Fire Class)             |
| `004-flame-smoke-outdoors.jpg`      | Documents environmental variance during collection. | **Figure X: Outdoor Night Data Collection.** The sensor node capturing fire signatures in an outdoor environment to account for ambient noise and variance.                    | Chapter 6, Section 6.5 (Environmental Variance) |
| `005-smoke-only-indoors.jpg`        | Represents smoldering/non-flaming fire data.        | **Figure X: Smoldering Fire Simulation.** The sensor node capturing particulate and VOC signatures from a smoldering source without visible flame (Scenario A3).               | Chapter 6, Section 6.4 (Fire Class)             |
| `006-cooking-using-pan-indoors.jpg` | Documents the "False Alarm" class (Cooking).        | **Figure X: Cooking Fume False Alarm Scenario.** The sensor node capturing signatures from a frying pan, documenting the high VOC/Smoke but low CO profile (Scenario C1).      | Chapter 6, Section 6.4 (False-Alarm Class)      |
| `007-boiling-water-indoors-pt1.jpg` | Documents the "False Alarm" class (Steam).          | **Figure X: Steam and Humidity False Alarm Capture.** The sensor node positioned over boiling water to capture high humidity spikes without combustion products (Scenario C2). | Chapter 6, Section 6.4 (False-Alarm Class)      |
| `008-boiling-water-indoors-pt2.jpg` | Shows an alternative sensor placement for steam.    | **Figure X: Ambient Steam Collection.** The sensor node positioned in a kitchen setting during water boiling to capture dispersed steam signatures.                            | Chapter 6, Section 6.4 (False-Alarm Class)      |

### 8.2 Table Inventory

**Source File:** [`thesis/typst/tables/TABLE_PROPOSALS.md`](thesis/typst/tables/TABLE_PROPOSALS.md)

#### 8.2.1 Literature Review: Comparative Analysis

**Placement**: Chapter 2, Section 2.4 (False Alarm Mitigation and Research Synthesis)
**Purpose**: To contextualize this research within the current state-of-the-art.

| Research Study              | Sensors Used        | Classification Type | Primary Innovation                     | Reported Accuracy |
| :-------------------------- | :------------------ | :------------------ | :------------------------------------- | :---------------- |
| **Fonollosa et al. (2018)** | Chemical/Gas        | Binary              | Early detection of chemical fires      | 92.4%             |
| **Wang et al. (2023)**      | Multi-modal         | 3-Class             | Identification of CO as "Truth Sensor" | 98.1%             |
| **Meleti et al. (2024)**    | Thermal/Optical     | Binary              | Obscured fire detection via IR         | 95.0%             |
| **This Work (2026)**        | **6-Sensor Fusion** | **3-Class**         | **TinyML False Alarm Recognition**     | **100% (Lab)**    |

#### 8.2.2 Hardware: Sensor Specification Matrix

**Placement**: Chapter 4, Section 4.2 (Detailed Examination of Selected Sensors)
**Purpose**: To provide a technical summary of the node's sensing capabilities.

| Sensor Model | Modality          | Detection Range | Interface | Key Advantage                           |
| :----------- | :---------------- | :-------------- | :-------- | :-------------------------------------- |
| **SEN0570**  | Smoke/Particulate | Analog (Rel.)   | Analog    | Ethanol Compatible (Low False Positive) |
| **DFR0076**  | IR Flame          | 760nm – 1100nm  | Analog    | < 1ms Response Time (Flicker Analysis)  |
| **SEN0566**  | VOC Gas           | 0 – 1000 ppm    | Analog    | Rapid Response to Chemical Vapors       |
| **SEN0564**  | Carbon Monoxide   | 1 – 1000 ppm    | Analog    | High Selectivity (Combustion Truth)     |
| **AHT20**    | Temp/Humidity     | -40 to +85°C    | I2C       | ±0.3°C Accuracy (Heat Paradox Analysis) |

#### 8.2.3 Architecture: Asymmetric Multi-Processing (AMP) Split

**Placement**: Chapter 5, Section 5.1 (The Autonomous Edge-Node Architecture)
**Purpose**: To define the functional separation between the "Brain" and the "Backbone."

| Feature               | RA4M1 "Inference Brain"        | ESP32-S3 "Connectivity Backbone" |
| :-------------------- | :----------------------------- | :------------------------------- |
| **Primary Role**      | Sensing, DSP, TinyML Inference | WiFi, MQTT, Security, Telemetry  |
| **Core Architecture** | ARM Cortex-M4 (32-bit)         | Xtensa LX7 (Dual-core)           |
| **Clock Speed**       | 48 MHz                         | 240 MHz                          |
| **Critical Resource** | Floating Point Unit (FPU)      | Integrated WiFi/Bluetooth Radio  |
| **Data Flow**         | Master (Decision Maker)        | Slave (Communication Bridge)     |

#### 8.2.4 Methodology: Data Collection Scenario Catalog

**Placement**: Chapter 6, Section 6.4 (Class-Specific Data Collection Scenarios)
**Purpose**: To map the environmental triggers used to train the multi-sensor model.

| Class           | ID  | Scenario Name       | Primary Physical Signature                |
| :-------------- | :-- | :------------------ | :---------------------------------------- |
| **Fire**        | A1  | Close Range Flame   | High Flame (>800), Rising Smoke/CO        |
| **Fire**        | A3  | Smoldering Material | High Smoke/VOC, Low Flame IR              |
| **No-Fire**     | B1  | Ambient Office      | Stable Baseline (Low readings across all) |
| **False Alarm** | C1  | Cooking Fumes       | **High VOC/Smoke, Negligible CO**         |
| **False Alarm** | C2  | Steam / Humidity    | **High Humidity (>80%), Stable CO/VOC**   |
| **False Alarm** | C3  | Alcohol Sprays      | **Extreme VOC Spikes, Stable Flame/CO**   |

#### 8.2.5 Economics: Estimated Bill of Materials (BOM)

**Placement**: Chapter 9, Section 9.4 (Deployment Scenarios and Scalability)
**Purpose**: To provide financial justification for the "Autonomous Node" approach.

| Component Category   | Specific Item             | Est. Unit Cost (USD) | % of Total |
| :------------------- | :------------------------ | :------------------- | :--------- |
| **Microcontroller**  | Arduino UNO R4 WiFi       | $27.50               | 34%        |
| **Chemical Sensing** | Smoke, VOC, CO Sensors    | $35.00               | 43%        |
| **Environmental**    | Flame, Temp/Hum Sensors   | $12.00               | 15%        |
| **Infrastructure**   | Enclosure, Wiring, PCB    | $6.50                | 8%         |
| **Total Node Cost**  | **Fully Integrated Unit** | **$81.00**           | **100%**   |
