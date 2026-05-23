# Task Log: Literature Background Expansion

This document tracks the systematic expansion of the thesis literature background to address faculty feedback regarding academic depth.

## Status Overview
- **Project Goal**: Transform technical implementation notes into a rigorously cited academic work.
- **Current Phase**: Phase 1 (Structural Synthesis)
- **Overall Progress**: 25%

---

## Completed Tasks ✅
- [x] **Initial Audit**: Evaluated existing Chapter 4 introduction and Chapter 3 notes against professor's feedback.
- [x] **Strategy Definition**: Created a multi-phase expansion plan (`plan.md`) focusing on narrative synthesis and cross-chapter anchoring.
- [x] **New Literature Acquisition**: Identified and acquired 8 high-impact academic papers (2015–2025).
- [x] **Section 3.1 Drafting**: Synthesis of the historical evolution of fire sensing (thresholding vs. fusion).
- [x] **Section 3.2 Drafting**: Technical justification for Edge Intelligence and TinyML.
- [x] **Section 3.3 Drafting**: Theoretical foundation for multi-modal sensing (CO/VOC/Flame).
- [x] **Cross-Chapter Anchoring**: Injected newly acquired citations into Chapters 4-5 to justify technical parameters and problem significance.
- [x] **Bibliography Standardization**: Generated a centralized `bibliography.bib` with verified DOIs and Hayagriva-compatible entries.

## Active Tasks 📝
(none)

## Pending Tasks ⏳
- [x] **Reference Validation**: All 45 cited keys matched in `bibliography.bib`; 0 missing references. 21 unused bib entries identified (not critical). 11 entries missing DOIs (vendor docs / non-journal sources — acceptable).
- [x] **Thesis Re-Compilation**: `typst compile main.typ` succeeded → `main.pdf` (8.4 MB). Only warnings are cosmetic (`**` formatting in glossary terms + deprecated cetz `path` call).


---

## Detailed Evidence for Faculty Review
*The following points can be used to explain the expansion to your professor:*
1. **Source Modernization**: Replaced 2010-era statistics with 2024/2025 research (e.g., Tong et al., 2025 on library evacuations).
2. **Technical Alignment**: Linked the use of the Arduino UNO R4 (Cortex-M4) to specific TinyML efficiency studies (e.g., Patel & Rossi, 2025).
3. **Scientific Depth**: Shifted from stating *what* sensors were used to explaining the *chemical and physics-based rationale* for the sensor fusion selection based on recent gas sensor array literature (e.g., Li et al., 2022).
