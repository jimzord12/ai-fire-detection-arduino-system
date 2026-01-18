# Thesis Writing Guide & Workflow Protocols

## 1. The "Robotic" Framing Strategy (CRITICAL)
Your work assignment mentions a "Robotic Platform" (25% grade). Since you are building a **Stationary** device, you must use specific language to satisfy this requirement.

- **Terminology:** Never call it just a "detector." Use terms like:
  - *"Autonomous Sensing Node"*
  - *"Edge Intelligence Unit"*
  - *"Cyber-Physical Fire System"*
- **The "Platform" Argument:**
  - A robot is defined by **Autonomy** (Deciding to alarm without cloud help) and **Perception** (Sensors).
  - Emphasize the **UNO R4 WiFi Architecture**: The Renesas chip acts as the "Brain" (Reflexes), and the ESP32 acts as the "Radio" (Telemetry). This is a robotic controller architecture.
- **Location Requirement:** You don't have GPS. Instead, describe your **"Static Location Tagging"** firmware feature (e.g., hardcoding `Zone_ID: Kitchen_North` into the MQTT payload). This *is* location-based information.

## 2. Tools & Workflow (Typst)
**Typst** is highly recommended over LaTeX for this project. It is faster, has instant preview, and easier code blocks.

- **Setup:**
  - Structure: `main.typ`, `chapters/`, `figures/`.
  - Use the **IEEE Thesis Template** for Typst.
- **Figures & Charts:**
  - Do NOT screenshot tables. Use Typst `table()` function.
  - Export Edge Impulse charts as `.svg` or high-res `.png` for crisp zooming.
- **Bibliography:**
  - Use a `.yml` or `.bib` file.
  - Cite immediately while writing: `@author2024fire` or `#cite("paper_id")`.

## 3. Academic Content Checklist

### The "Ablation Study" (Chapter 8)
To prove your system is good, you must prove that **Fusion > Single Sensor**.
- **Task:** Train a "dummy" model on *only* Smoke data. Train another on *only* Temp data.
- **Result:** Show that the Smoke-only model triggers false alarms on "Vaping" or "Cooking," while your Fusion model (Smoke + Gas + Temp) correctly identifies it as "False Alarm."
- **Why:** This is the strongest academic argument you can make.

### Safety & Ethics (Chapter 6 & 9)
Since you are lighting fires:
- Document your safety gear (Fire Extinguisher Class ABC, ventilation fans, metal trays).
- Mention **"Ethical AI"**: Discuss the consequence of a False Negative (Fire not detected = loss of life). This raises the stakes of your thesis.

### Key Search Terms for Literature Review
Use these in Google Scholar/IEEE Xplore:
- *Primary:* "Multi-sensor Data Fusion Fire Detection," "TinyML Edge Implementation," "False Alarm Reduction in WSN."
- *Secondary:* "Context-Aware Smart Home Safety," "Indoor Air Quality (IAQ) vs. Fire Signatures," "Low-Power Gas Sensing Arrays."
- *Standards:* "EN 54 Fire Detection Standards," "NFPA 72 Testing Protocols."

## 4. Writing Style Guidelines
- **Passive vs. Active:** Use Active voice where possible.
  - *Bad:* "The data was collected by the sensor..."
  - *Good:* "The sensor sampled data at 10Hz..."
- **Tense:**
  - Use **Past Tense** for what you did (*"We calibrated the sensors..."*).
  - Use **Present Tense** for established facts (*"Carbon Monoxide is a byproduct of incomplete combustion..."*).
- **Quantify Everything:**
  - Avoid: *"The system was fast."*
  - Use: *"The system achieved an inference latency of 42ms."*

## 5. Thesis-Specific Code Blocks
When presenting code in Appendices or text:
- **Don't paste the whole file.** Paste critical snippets (e.g., the Inference Loop).
- **Explain the "Why":**
  - *"We used a Ring Buffer to smooth sensor noise before feeding it to the classifier..."*
- **Edge Impulse Specifics:**
  - Document your **DSP Block parameters** (FFT length, Filter cutoffs). This is valid "Code" in the context of Low-Code ML.
