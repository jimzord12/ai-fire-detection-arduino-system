# Day-to-Day Setup Guide

Follow this guide at the start of every work session to ensure your development environment and Arduino connection are ready.

## 1. Physical Connection
**Action:** Connect your Arduino UNO R4 to the computer via USB.

## 2. USB Passthrough (Windows & WSL2)
*Since you are running in WSL2, the Arduino needs to be "passed through" from Windows.*

**Option A: Automated Script (Recommended)**
1.  Open **PowerShell as Administrator** (Windows).
2.  Run the helper script directly from the WSL share:
    ```powershell
    \\wsl.localhost\Ubuntu-24.04\home\jimzord-dev\projects\ai-fire-detection-arduino-system\tools\setup\connect-arduino.ps1
    ```
    *(Adjust the path if your distribution name is different)*

**Option B: Manual Method**
1.  **Open PowerShell as Administrator** (Windows).
2.  **Find the Bus ID:**
    ```powershell
    usbipd list
    ```
    *Look for "USB Serial Device" or "Arduino". Note the `BUSID` (e.g., `1-4`).*
3.  **Attach the Device:**
    ```powershell
    usbipd attach --wsl --busid <BUSID>
    ```
    *(Replace `<BUSID>` with your actual ID, e.g., `1-4`)*

**✅ Test:**
In your **Linux terminal**, run:
```bash
lsusb
```
*You should see a device named "Arduino" or "Renesas".*

## 3. Environment & Port Check
**Action:** Run the project's environment checker. This verifies tools and checks if the serial port is accessible.

```bash
./tools/setup/check-edge-impulse-env.sh
```

**✅ Test:**
- **Status:** All relevant tools (Node, Python, CLI) should show `[FOUND]`.
- **Port:** The script should confirm `Arduino IDE/CLI` presence, but more importantly, check if `/dev/ttyACM0` (or similar) exists.

## 4. Verify Serial Data
**Action:** Quickly check if data is streaming before starting full collection.

```bash
# Check if the port exists (usually /dev/ttyACM0)
ls -l /dev/ttyACM0

# Briefly read raw data (Press Ctrl+C to stop)
cat /dev/ttyACM0
```

**✅ Test:**
- You should see readable text/numbers scrolling (if the Arduino is programmed).
- If you see "Permission denied", run: `sudo chmod a+rw /dev/ttyACM0`

## 5. Ready to Work?
If all above passed, you are ready to:
- **Collect Data:** `./tools/collection/automated_data_collection.sh ...`
- **Upload Data:** `./tools/integration/upload_to_edge_impulse.sh ...`
- **Develop:** Open VS Code (`code .`).

---

## ⚡ Quick Troubleshooting

| Issue | Solution |
| :--- | :--- |
| `lsusb` is empty | Arduino not attached. Run `usbipd attach` in Admin PowerShell again. |
| `Permission denied` | Run `sudo chmod a+rw /dev/ttyACM0` or re-login. |
| `Resource busy` | Close other terminals/Serial Monitors using the port. |
| `usbipd` command not found | You are likely in a normal PowerShell. Open as **Administrator**. |
