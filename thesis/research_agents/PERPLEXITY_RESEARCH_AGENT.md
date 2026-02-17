# Perplexity AI Research Agent: Shared Context

This document provides the foundational context for all research queries related to the thesis. Use this context as a prefix for all Perplexity AI prompts to ensure consistency and relevance.

---

## Project Overview

- **Title**: Autonomous Multi-Sensor Fire Detection Node Using Sensor Fusion and TinyML
- **Goal**: Develop an intelligent edge-deployed fire detection system using an Arduino UNO R4 WiFi (Renesas RA4M1 + ESP32-S3).
- **Key Innovation**: Three-class classification (**fire**, **no_fire**, **false_alarm**) to reduce false positives from cooking fumes, steam, and cleaning products.
- **Sensors**: Smoke (MEMS), VOC (MEMS), CO (MEMS), IR Flame (760nm–1100nm), and Temperature/Humidity (AHT20).
- **ML Framework**: TinyML (Edge Impulse) deployed on Cortex-M4.

## Research Methodology

- **Literature Review**: PRISMA-inspired rapid Systematic Literature Review (SLR).
- **Search Period**: 2015–Present.
- **Databases**: IEEE Xplore, ScienceDirect, ACM Digital Library, MDPI, SpringerLink.
- **Standards**: EN 54 (Fire detection and fire alarm systems), NFPA 72 (National Fire Alarm and Signaling Code).

## Citation Requirements

- **Format**: APA 7th Edition.
- **Requirement**: Every claim must be backed by a citation. Provide a full reference list at the end of each response.
- **Source Quality**: Prioritize peer-reviewed journals and conference papers.

## Glossary (Optional)

Include this section if the query involves highly technical concepts:

- **TinyML**: Machine learning models optimized to run on low-power microcontrollers.
- **Sensor Fusion**: Combining data from multiple sensors to reduce uncertainty and improve detection accuracy.
- **MEMS**: Micro-Electro-Mechanical Systems; miniaturized mechanical and electro-mechanical elements.
- **VOC**: Volatile Organic Compounds; organic chemicals that have a high vapor pressure at room temperature.
- **Cortex-M4**: A 32-bit RISC ARM processor core designed for low-cost, energy-efficient microcontrollers.

---

## Usage Instructions

1. Copy the **Project Overview**, **Research Methodology**, and (optionally) **Glossary** sections.
2. Append the specific **Section Research Prompt** from the corresponding `research_query.md` file.
3. Execute the combined prompt in Perplexity AI.
