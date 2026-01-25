# Connect Arduino Script

## Description
This PowerShell script automates the process of identifying your Arduino UNO R4 and attaching it to WSL2 using `usbipd-win`.

## Prerequisite
- You must be on **Windows**.
- You must have `usbipd-win` installed.
- You must run PowerShell as **Administrator**.

## Usage
1. Open PowerShell as Administrator.
2. Navigate to this folder (e.g., via `\\wsl$\...` or if you have the repo cloned in Windows).
3. Run:
   ```powershell
   ./connect-arduino.ps1
   ```

## What it does
1. Lists USB devices.
2. Finds the device matching Arduino's Vendor ID (`2341`).
3. Attaches it to WSL2.
4. Verifies the connection by running `lsusb` inside WSL.
