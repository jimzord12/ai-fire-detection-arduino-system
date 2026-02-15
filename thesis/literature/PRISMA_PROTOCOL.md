# PRISMA-Inspired Rapid SLR Protocol (Semester Thesis)

**Project**: Autonomous multi-sensor fire detection node using sensor fusion + TinyML

**Alignment note**: This protocol is written to match `thesis/THESIS_OUTLINE.md` (Chapter 2.0) and is intended to be implemented and reported inside Chapter 2. Front/back matter are completed after the body chapters are drafted.

**Scope constraints (fixed)**

- **Publication year**: include **2015–present** only
- **Domains**: **indoor + wildland** (explicitly include both; tag each paper)
- **Fusion approaches**: include what the thesis already covers (e.g., **Kalman**, **Bayesian**, **Neural Networks**, and related fusion strategies)
- **Goal**: systematic enough to be defensible, lightweight enough for a semester thesis

---

## 1. Review Questions (mapped to the thesis)

These are _literature review_ questions (LRQs) that support your thesis research questions.

- **LRQ1 (State of the art)**: What sensor modalities and fusion methods are used for fire detection and for reducing false alarms (indoor and wildland)?
- **LRQ2 (Edge feasibility)**: What is the current evidence that on-device/edge ML (TinyML, MCU-class, embedded) is viable for real-time fire detection?
- **LRQ3 (False-alarm handling)**: What strategies are used to handle nuisance alarms (data-driven multi-class labeling, context-aware rules, hybrid ML + heuristics, sensor redundancy)?

**Where this lands in the thesis**: Chapter 2 supports Chapter 3 (theory), Chapter 6 (data methodology), and Chapter 8 (evaluation/ablation framing).

---

## 2. Eligibility Criteria

### 2.1 Inclusion Criteria

A record is eligible if it meets **all** of the following:

- **Year**: published **>= 2015**
- **Language**: English
- **Type**: peer-reviewed conference/journal OR recognized standards/technical reports (standards are handled separately; see Section 2.3)
- **Topic relevance**: addresses at least one of:
  - fire detection (indoor, building, industrial) OR wildfire/wildland detection
  - multi-sensor or sensor fusion for fire detection
  - false alarm / nuisance alarm mitigation
  - embedded / edge / TinyML / microcontroller deployment (or resource constraints)
- **Evidence**: includes a method plus at least one of: evaluation metrics, experimental setup, dataset description, or a clearly described deployment constraint

### 2.2 Exclusion Criteria

Exclude records that match **any** of the following:

- Published before **2015**
- Non-technical summaries (news, blogs, marketing)
- Patents (optional: keep a separate “background” list if you want)
- No method and no evaluable evidence (pure opinion pieces)
- Not about fire detection (e.g., general IAQ monitoring with no fire framing)

### 2.3 Handling Standards & Datasheets (not counted in PRISMA totals)

For a fire-safety adjacent thesis, it’s reasonable to cite:

- standards (e.g., EN 54, NFPA 72)
- sensor datasheets and platform manuals

Treat these as **supporting technical sources** (track them in a short list), but do **not** count them as “studies included” in the PRISMA flow.

---

## 3. Information Sources

Use a core set, plus a lightweight “top-up” source.

**Core databases** (recommended):

- IEEE Xplore
- ACM Digital Library
- Scopus (if available) or Web of Science (if available)
- ScienceDirect / Elsevier (optional)
- SpringerLink (optional)

**Top-up / discovery**:

- Google Scholar (for forward/backward citation snowballing and missing-index papers)

---

## 4. Search Strategy (2015–present)

### 4.1 Query Blocks

Use a modular query so you can adapt to each database syntax.

**Block A — Fire domain**

- ("fire detection" OR "smoke detection" OR wildfire OR wildland OR "forest fire")

**Block B — Fusion / multi-sensor**

- ("sensor fusion" OR multisensor OR "multi-sensor" OR "data fusion" OR Kalman OR Bayesian OR "neural network")

**Block C — False alarm**

- ("false alarm" OR "nuisance alarm" OR "alarm reduction" OR "false positive")

**Block D — Edge / embedded (optional but important)**

- (TinyML OR "edge AI" OR embedded OR microcontroller OR MCU OR "on-device")

### 4.2 Recommended Baseline Search Strings

Use **two primary queries** and record both in the screening log (so indoor + wildland are guaranteed coverage).

**Query 1 (Indoor/buildings focus)**

- Block A with ("building" OR indoor OR home OR industrial) AND Block B AND (Block C OR Block D)

**Query 2 (Wildland focus)**

- Block A with (wildfire OR wildland OR forest) AND (Block B OR Block D) AND (Block C OR "early detection")

**Filters**

- Year: 2015–present
- Language: English
- Document type: journals + conferences

### 4.3 Snowballing Rules

After you have an initial “included” set:

- backward snowballing: scan references of top 10 most relevant
- forward snowballing: use Scholar “cited by” on top 10 most relevant
- apply the same inclusion/exclusion criteria

---

## 5. Selection Process (PRISMA-inspired)

### 5.1 Workflow

1. Run searches in each database using Query 1 and Query 2.
2. Export all results to a single manager (Zotero / Mendeley / EndNote).
3. Deduplicate.
4. Screen titles/abstracts.
5. Retrieve full text for “include” and “maybe”.
6. Full-text screening.
7. Final inclusion set.

### 5.2 Roles (single-author semester thesis)

- Screening is performed by one reviewer (you).
- To reduce bias, do a **second-pass consistency check** on a random ~10% sample of title/abstract decisions.

---

## 6. Data Extraction (what to record per included study)

Use the extraction template to make synthesis easy.

**Bibliographic**

- citation key, authors, year, venue, DOI/URL

**Domain tag**

- indoor / wildland / both

**Sensing**

- modalities (smoke, CO, VOC, temperature/humidity, IR flame, camera, satellite, etc.)

**Learning / fusion**

- fusion level (data/feature/decision)
- method: Kalman / Bayesian / NN / ensemble / rules / hybrid

**Task definition**

- classes (binary vs multi-class), explicit false-alarm class (yes/no)

**Evaluation**

- metrics reported (accuracy, F1, sensitivity/recall, FAR/false positive rate)
- dataset size + scenario description

**Edge feasibility**

- target hardware (MCU, SBC, GPU) + latency/power/memory if reported

---

## 7. Quality Appraisal (lightweight)

Score each included study 0–2 on each criterion (max 10–12 points).

- Q1: Clear sensor setup and environment described
- Q2: Dataset/scenarios described sufficiently
- Q3: Metrics appropriate and clearly reported
- Q4: Method is replicable (or clearly specified)
- Q5: False alarms discussed with evidence
- Q6 (optional): Edge constraints measured (latency/memory/power) if claiming “embedded/edge”

Use the score to prioritize discussion (do **not** automatically exclude unless a paper is unusable).

---

## 8. Synthesis Plan (how Chapter 2 will be written)

### 8.1 Output artifacts

- A comparison table (sensor set, fusion method, classes, domain, deployment)
- A narrative synthesis organized by:
  1. indoor vs wildland patterns
  2. fusion families (Kalman/Bayesian/NN/hybrid)
  3. false-alarm strategies
  4. edge feasibility evidence

### 8.2 How it supports your thesis argument

- Justifies your three-class framing (fire/no_fire/false_alarm)
- Justifies sensor selection as complementary modalities
- Creates a “gap statement”: limited embedded multi-modal + explicit false-alarm class + real-world nuisance scenarios

---

## 9. PRISMA Flow (placeholders)

Fill counts as you execute the search.

- Records identified (databases): **n = \_\_\_\_**
- Records identified (other sources / snowballing): **n = \_\_\_\_**
- Records after duplicates removed: **n = \_\_\_\_**
- Records screened (title/abstract): **n = \_\_\_\_**
- Records excluded (title/abstract): **n = \_\_\_\_**
- Full-text assessed: **n = \_\_\_\_**
- Full-text excluded (with reasons): **n = \_\_\_\_**
- Studies included (peer-reviewed): **n = \_\_\_\_**

A PRISMA-ready flow diagram template lives in the same folder.
