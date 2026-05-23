# Academic Progress Report: Thesis Refinement and Literature Expansion
**Student:** Taxiarchis Papadimitriou  
**Date:** March 6, 2026  
**Subject:** Response to Faculty Feedback regarding Academic Depth and Literature Background

## Executive Summary
Following the initial review of the technical implementation, a systematic expansion of the thesis has been completed. The work has been transitioned from a system design document into a comprehensive academic thesis that satisfies the European University Cyprus (EUC) 12-section requirement, with a specific focus on anchoring edge-computing decisions in current (2020–2025) academic literature.

---

## 1. Structural Refactoring (EUC Standards)
The thesis architecture has been realigned with the mandatory 12-section EUC template to ensure formal academic compliance:
- **Sections 1–3:** Formalized Front Matter (Acknowledgements, Abstract, Table of Contents).
- **Section 3 (New):** *Literature Review and Theoretical Background* (Dedicated synthesis chapter).
- **Sections 4–8:** System context, methodology, implementation, and experimental validation.
- **Sections 11–12:** Technical Installation and User Manuals (Satisfying the practical engineering requirement).

## 2. Theoretical Background & Literature Synthesis
A new, robust narrative chapter (Section 3) has been drafted to replace previous fragmented technical notes. This chapter establishes the "Robotic" context of the project through three primary pillars:
- **3.1 Evolution of Multi-Sensor Fire Detection:** Traces the historical transition from single-threshold ionization/photoelectric sensors to intelligent "physical fingerprinting" using sensor fusion (citing *Fonollosa et al., 2018* and *Wang et al., 2025*).
- **3.2 Edge Intelligence and TinyML:** Provides the theoretical justification for decentralized processing, focusing on latency, privacy, and deterministic reliability in life-safety systems (citing *Alajlan, 2022* and *Tummala, 2025*).
- **3.3 Multi-Modal Sensing Principles:** Details the underlying physics of MEMS gas sensing and IR flicker analysis, establishing the scientific basis for the chosen sensor suite.

## 3. Citation Modernization & Anchor Points
Existing chapters have been "anchored" with 15+ new peer-reviewed citations to justify specific technical decisions:
- **Socio-Economic Impact:** Anchored the problem statement with recent data on the economic cost of false alarms (£1B/year) and the "Cry Wolf" behavioral effect (*Rigos et al., 2019*; *Festag, 2016*).
- **Sampling Strategy:** Justified the 10Hz unified sampling rate and 2-second temporal window using recent TinyML optimization studies (*Samanta et al., 2024*).
- **Model Optimization:** Anchored the INT8 quantization strategy in recent surveys of Deep Learning for resource-constrained MCUs (*Das et al., 2025*).

## 4. Robotic Framing & Scientific Humility
In accordance with the "Robotic Platform" requirement (25% of grade):
- The device is now formally characterized as an **Autonomous Sensing Node** or **Edge Intelligence Unit**.
- The architecture is described through its **Asymmetric Multi-Processing (AMP)** capabilities, separating reflexive sensing (Cortex-M4) from high-level telemetry (ESP32).
- Performance claims have been reframed with "Scientific Humility," documenting the 100% accuracy achieved in lab conditions while explicitly discussing the "Lab-to-Real-World gap" and sensor drift in Section 8.

## 5. Verification
- **Bibliography:** All references have been consolidated into a global Hayagriva-compatible `.bib` file with verified DOIs.
- **Compilation:** The document successfully compiles via **Typst**, ensuring high-fidelity rendering of mathematical notations and tables.

---
**Status:** Ready for formal supervisor review of the expanded narrative and theoretical framework.
