# Thesis Writing Guide & Workflow Protocols

## 1. The "Robotic" Framing Strategy (CRITICAL)

Your work assignment mentions a "Robotic Platform" (25% grade). Since you are building a **Stationary** device, you must use specific language to satisfy this requirement.

- **Terminology:** Never call it just a "detector." Use terms like:
  - _"Autonomous Sensing Node"_
  - _"Edge Intelligence Unit"_
  - _"Cyber-Physical Fire System"_
  - _"Hybrid Hardware-AI Decision Fusion Node"_
- **The "Platform" Argument:**
  - A robot is defined by **Autonomy** (Deciding to alarm without cloud help) and **Perception** (Sensors).
  - Emphasize the **UNO R4 WiFi Architecture**: The Renesas chip acts as the "Brain" (Reflexes), and the ESP32 acts as the "Radio" (Telemetry). This is a robotic controller architecture.
- **Location Requirement:** You don't have GPS. Instead, describe your **"Static Location Tagging"** firmware feature (e.g., hardcoding `Zone_ID: Kitchen_North` into the MQTT payload). This _is_ location-based information.

## 2. Tools & Workflow (Typst)

**Typst** is highly recommended over LaTeX for this project. It is faster, has instant preview, and easier code blocks.

- **Setup:**
  - Structure: `main.typ`, `chapters/`, `figures/`.
  - Use the **APA 7th Edition Thesis Template** for Typst (as configured in `main.typ`).
- **Figures & Charts:**
  - Do NOT screenshot tables. Use Typst `table()` function.
  - Export Edge Impulse charts as `.svg` or high-res `.png` for crisp zooming.
- **Bibliography:**
  - Use a `.yml` or `.bib` file.
  - Cite immediately while writing: `@author2024fire` or `#cite("paper_id")`.

## 3. Academic Content Checklist

### The "Clean Fire" Paradox (Chapter 8 & 9)

This is a high-value contribution for your thesis:
- **The Problem:** A TinyML model trained on "Smoky Fusion" fires may ignore a "Clean" flame (like a lighter) because it doesn't see the smoke it expects.
- **The Solution:** Implement a **Hybrid Logic Layer**.
- **Academic Hook:** Discuss the "Model Generalization Gap" and why **Deterministic Hardware Overrides** (e.g., Flame > 800) are mandatory for safety-critical edge systems.
- **Terminology:** Use **"Heuristic Suppression"** to describe how the system filters out sunlight/glare that fools the AI.

### The "Ablation Study" (Chapter 8)

To prove your system is good, you must prove that **Fusion > Single Sensor**.

- **Task:** Train a "dummy" model on _only_ Smoke data. Train another on _only_ Temp data.
- **Result:** Show that the Smoke-only model triggers false alarms on "Vaping" or "Cooking," while your Fusion model (Smoke + Gas + Temp) correctly identifies it as "False Alarm."
- **Why:** This is the strongest academic argument you can make.

### Safety & Ethics (Chapter 6 & 9)

Since you are lighting fires:

- Document your safety gear (Fire Extinguisher Class ABC, ventilation fans, metal trays).
- Mention **"Ethical AI"**: Discuss the consequence of a False Negative (Fire not detected = loss of life). This raises the stakes of your thesis.

### Key Search Terms for Literature Review

Use these in Google Scholar/IEEE Xplore:

- _Primary:_ "Multi-sensor Data Fusion Fire Detection," "TinyML Edge Implementation," "False Alarm Reduction in WSN."
- _Secondary:_ "Context-Aware Smart Home Safety," "Indoor Air Quality (IAQ) vs. Fire Signatures," "Low-Power Gas Sensing Arrays."
- _Standards:_ "EN 54 Fire Detection Standards," "NFPA 72 Testing Protocols."

## 4. Writing Style Guidelines

- **Voice (safe default):** Use an **impersonal academic voice**. Passive/impersonal phrasing is acceptable and often preferred for this document.
  - _Good:_ "Data were collected at 10 Hz using the multi-sensor node..."
  - _Good:_ "The system sampled data at 10 Hz..." (active but still impersonal)
  - _Avoid:_ "We collected data..." / "I built the system..." unless explicitly required.
- **Tense:**
  - Use **Past Tense** for what was done (_"The sensors were calibrated..."_).
  - Use **Present Tense** for established facts (_"Carbon Monoxide is a byproduct of incomplete combustion..."_).
- **Quantify Everything:**
  - Avoid: _"The system was fast."_
  - Use: _"The system achieved an inference latency of 42ms."_

### Glossary-first approach (do not over-explain in body text)

- The main body should not stop to define basic terms (microcontroller, inference, dataset, etc.).
- If a section introduces specialized terms, add a short **section-local Glossary** subsection at the end of that atomic section.
- The global glossary in front matter is completed after the body is composed.

Typst helper (preferred for consistency):

- Use `#section_glossary(( (term: "...", def: "..."), ... ))` (defined in `thesis/typst/common/glossary.typ`).

## 6. Typst Conversion & Technical Friction Points

When converting Markdown drafts to Typst, be aware of these common syntax and workflow issues:

### Syntax Differences
- **Bold Text**: Typst uses single asterisks (`*bold*`) for strong emphasis. Markdown's double asterisks (`**bold**`) will trigger a "no text within stars" warning in Typst.
- **Math Mode & Special Characters**: The dollar sign (`$`) automatically triggers math mode in Typst. Financial figures or variables containing `$` must be escaped as `\$` (e.g., `\$19.1 billion`) to avoid compilation errors.

### Bibliography Management
- **Key Consistency**: Ensure citation keys in `bibliography.bib` are descriptive and consistent (e.g., `authorYEARtitle`). 
- **Consolidation Workflow**: Appending references to the global `.bib` file is best handled via the `replace` tool or direct file edits rather than shell redirection to ensure multi-line BibTeX structures remain intact.
- **Drafting Tip**: Keep a "Section BibTeX" block at the bottom of your drafting markdown files to make extraction and integration into the global bibliography faster.

### Compilation Troubleshooting
- If a chapter fails to compile after a `#include`, check the newly added `content.typ` for unescaped special characters (like `$` or `%`).
- Typst warnings about "multiple consecutive stars" are usually a sign that Markdown-style bolding was not converted.

## 7. Thesis-Specific Code Blocks

When presenting code in Appendices or text:

- **Don't paste the whole file.** Paste critical snippets (e.g., the Inference Loop).
- **Explain the "Why":**
  - _"We used a Ring Buffer to smooth sensor noise before feeding it to the classifier..."_
- **Edge Impulse Specifics:**
  - Document your **DSP Block parameters** (FFT length, Filter cutoffs). This is valid "Code" in the context of Low-Code ML.
