## Data

### Starter Plan (3 Classes)

Assuming your labels are `fire`, `no_fire`, and `false_alarm`, a realistic minimum to start training is:

#### `fire` (2–3 situations)

- Small flame close to sensors, low ventilation.
- Small flame farther away, normal ventilation.
- Optional: “smoldering” / smoky fire (less flame, more smoke/VOC/CO).

#### `no_fire` (2–3 situations)

- Normal room air (baseline) across times of day.
- High humidity / temperature changes (e.g., hot room, AC turning on).
- Optional: dusty air / fan airflow (if that changes your smoke sensor).

#### `false_alarm` (2–4 situations)

These are usually the most important.

- Cooking fumes / frying.
- Steam (kettle/shower), if relevant.
- Aerosol sprays / alcohol vapors / cleaning products (VOC spikes).
- Vehicle exhaust or similar fumes (if that’s a known risk for your use case).

This aligns with the general idea that collecting representative “non-fire but suspicious” conditions is key to reducing nuisance alarms.

### How Much Data per Situation

A solid beginner goal is:

- 2–5 minutes per situation, saved as multiple files (e.g., 10–30 second CSV files each).

That typically yields ~10+ minutes per class if you do several situations per class, which is a common “decent starting point” guideline in Edge Impulse tutorials (even though the exact number depends on signal complexity).

### Concrete Numbers to Aim For

If each CSV sample is 10 seconds long:

- Start with 30–60 samples per class (5–10 minutes per class).

If accuracy is poor, the first fix Edge Impulse recommends is usually “add more data,” especially for underrepresented classes.
