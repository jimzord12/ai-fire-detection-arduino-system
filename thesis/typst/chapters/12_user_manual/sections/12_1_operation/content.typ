== System Operation

=== Normal Operation
Upon initialization, the system performs a diagnostic check on all sensors (specifically the AHT20 I2C connection). During normal operation:

- *Idle State*: The system samples sensors at 10Hz and performs local TinyML inference. If no combustion markers are detected, the system remains in a low-priority telemetry state.
- *Alert State*: If the TinyML model outputs a `Fire` probability greater than 0.70, the system initiates a verification process.

=== Understanding Alerts
The system uses a hybrid decision-making logic to mitigate false alarms:

1. *AI Probe (Stage 1)*: If the model identifies a fire signature, the serial output will display `[AI Probe] Fire: X.XX | No-Fire: X.XX | Flame: XXX`.
2. *Hardware Verification (Stage 2)*: If AI says fire, but Smoke and Flame readings are within ambient levels, the system suppresses the alarm (indicated as `[Suppressing] ...`).
3. *Critical Override (Stage 3)*: If the Flame sensor exceeds a high-intensity threshold (>800), the system triggers an immediate alarm, bypassing AI deliberation.
4. *Alarm Triggered*: The final alert state is confirmed by the output `>>> ALARM TRIGGERED! <<<`.
