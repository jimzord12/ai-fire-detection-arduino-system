# Plan: Expanding Thesis Literature Background

## Objective
Address the feedback that the thesis lacks sufficient academic literature background by transforming existing literature collection into a robust, argument-driven Chapter 3 and integrating citations throughout the thesis body.

## Phase 1: Structural Expansion of Chapter 3
- **Goal**: Convert current literature notes into a full narrative chapter.
- **Actions**:
  1. Define Chapter 3 structure:
     - 3.1: Historical evolution of fire sensing (threshold vs. fusion).
     - 3.2: TinyML and Edge Intelligence advancements.
     - 3.3: Theoretical basis for sensor fusion (CO, VOC, Flame).
  2. Synthesize existing PRISMA papers (from `thesis/literature/chapters/003-chapter/003.md`) into these sections.
  3. Create individual section files in `thesis/typst/chapters/03_literature_review/`.

## Phase 2: Citation Integration
- **Goal**: Anchor technical implementation decisions in peer-reviewed theory.
- **Actions**:
  1. Review Chapters 4-8 (Implementation/Analysis).
  2. Inject at least 2-3 academic citations per chapter to justify:
     - Sensor selection (e.g., why CO is the "truth" sensor).
     - Methodology (e.g., why 10Hz sampling is chosen).
     - Model choice (e.g., TinyML quantization benefits).

## Phase 3: Validation and Synchronization
- **Goal**: Ensure the thesis structure remains coherent and technically valid.
- **Actions**:
  1. Consolidate local section `.bib` files into global `thesis/typst/bibliography.bib` using `./tools/utils/sync-bib.sh`.
  2. Run `ref-tools/verify-references.ts` to ensure no non-academic sources remain.
  3. Compile the thesis (`./tools/typst/compile.sh`) to verify formatting.

## Timeline
- **Step 1**: Structure Chapter 3 (1-2 turns).
- **Step 2**: Draft sections (3-5 turns).
- **Step 3**: Integrate and sync (2 turns).
