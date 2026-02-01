# Edge Impulse Platform - Feature Generation with Spectral Analysis

## Guide

**Goal:** Extract meaningful numbers (features) from the raw signals.

**Navigate:** Go to `Impulse design (Sidebar) → Spectral features`.

### Parameters (Tab)

- **Scale axes** — leave this to 1.

- **Filter Type** — _None_ (recommended). Use _Low-pass_ only if readings are very noisy.

- **FFT Length** — Keep the default (e.g., 16).

- **Advanced (optional)** — You may disable _Take log of spectrum_ for gas sensors if you need fine control, but defaults work well for beginners.

### Generate features

1. Click **Save parameters**.
2. Click **Generate features**.
3. Wait for the process to complete.

### Feature Explorer

- Inspect the 3D graph — you should see clusters by class (e.g., **Blue = no_fire**, **Orange = fire**, **Green = false_alarm**).
- **Good sign:** the **Fire** cluster is separated from **No Fire**. ✅
- **Common overlap:** **False Alarm** (e.g., cooking) may sit near **Fire** — this is expected; the neural network will learn the boundaries.

## Encountered Issues

### Error: Sample is missing axis "humid"

This means your Impulse Design expects a sensor axis named humid, but the sample currently loaded (file no_fire_open_space_20260125...) does not have that column name (or has it named differently).

In some of my CSV files, I had named the Humidity column as "humid" instead of "hum", which caused this error.

I fixed it by renaming the column in the CSV file to match the expected axis name in the Impulse Design.

To make my life easier, instead of uploading each class/label individually, I created this simple bash script that uploads all the CSV files using the upload tool (`tools/integration/upload_all_to_edge_impulse.sh`).

## Some comments on the data

**Short verdict:** This screenshot looks fantastic — you're perfectly on track. ✅

### Why this looks good

- **DSP result (graph on the right)**
  - **After filter:** Clean waveforms that show real sensor variation — exactly what the model learns from.
  - **Spectral power:** Energy concentrated at low frequencies (left side), which is typical for environmental sensors (values drift rather than oscillate like audio).
  - **Processed features:** A list of numbers in the bottom-right — these are the inputs your neural network will receive.
  - **No errors:** The red error text is gone.

### On-device performance

- **Processing time:** ~1 ms ⚡ — lightning fast; the `Arduino R4` (`Cortex-M4`) will handle this effortlessly.
- **RAM usage:** ~1 KB — tiny. The `UNO R4` has ~32 KB RAM, leaving plenty of room for the Wi‑Fi stack and other logic. 🔧

### Feature Explorer — Analysis

**Short verdict:** Promising but there is a tricky middle region. ✅

#### Good news

- Clear separation is present:
  - **Blue (false_alarm)** — distinct cluster on the far left; indicates _Steam/Humidity_ scenarios are easy to reject.
  - **Orange (fire)** — a separate cluster at the top; likely _Close Range / Strong Fire_ samples.

#### The challenge — the "Messy Middle"

- The center-right shows a large overlap of **Green (no_fire)**, **Orange (fire)**, and **Blue (false_alarm)**.
- This is expected for _Smoldering Fire_ vs _Cooking_ vs _Hot Day_ since simple spectral features can appear similar.
- **Don't panic:** higher-dimensional features often resolve these overlaps; the plot shows only 3 dimensions. 💡

---

### Recommended training settings (to handle overlap) 🔧

Go to `Classifier` and apply the following:

- **Training cycles (epochs):** `100` — give the model time to converge. Default is 30.
- **Learning rate:** `0.0005` — slower and more precise than the default `0.001`.

#### Neural network architecture (starter)

- Use **2 Dense layers**:
  - **Layer 1:** 20–30 neurons
  - **Layer 2:** 10 neurons

**Tip:** If validation accuracy remains < 85%, try adding a 3rd layer or increasing neurons (e.g., Layer 1 → 40). Start simple and iterate. ⚠️
