# Collection Procedure & QA

## Equipment & Software

1. Arduino sketch: deploy data collection firmware (10 Hz serial output)
2. Edge Impulse Data Forwarder running on connected PC
3. Edge Impulse project with labels (`fire`, `no_fire`, `false_alarm`)
4. All five DFRobot sensors calibrated and verified

## Workflow (per scenario)

1. Initialize sensor array (warm-up ~30 s)
2. Start Data Forwarder stream
3. Trigger scenario condition
4. Wait 2–3 s for stabilization
5. Begin 10 s sample capture
6. Repeat 30 times (5 minutes)
7. Stop streaming; verify data in Edge Impulse Studio
8. Label samples appropriately

## QA Checks

- Verify serial output in Arduino Monitor (no dropped frames)
- Check Data Forwarder connection status
- **Verify CSV header & order:** Confirm CSV columns are `timestamp, smoke, voc, co, flame, temperature, humidity`
- Visual inspection of raw CSV in Edge Impulse
- Re-collect any scenario with <25 complete samples or obvious sensor malfunction

## Automated Collection Script

See `scripts.md` for details on `tools/collection/automated_data_collection.sh` and `tools/integration/upload_to_edge_impulse.sh` usage and examples.
