# Arduino IDE 2 (AppImage) on Ubuntu 24.04 — install & troubleshoot

## Install (recommended)
1) Enable Universe + install FUSE compatibility (required for many AppImages on 24.04):
```bash
sudo add-apt-repository universe
sudo apt update
sudo apt install libfuse2t64
```

2) Make the Arduino IDE AppImage executable:
```bash
cd ~/Downloads
chmod +x arduino-ide_2.*_Linux_64bit.AppImage
```

3) Start it from a terminal (best for seeing errors):
```bash
./arduino-ide_2.*_Linux_64bit.AppImage
```

## If double-click does nothing / won’t start
1) Try the Electron sandbox workaround:
```bash
./arduino-ide_2.*_Linux_64bit.AppImage --no-sandbox
```

2) Last resort if FUSE is blocked in your environment:
```bash
./arduino-ide_2.*_Linux_64bit.AppImage --appimage-extract-and-run
```

3) Avoid running the IDE with `sudo` (can break Electron sandboxing and permissions expectations).

## If Boards Manager fails (UNO R4 WiFi, etc.)
Symptom while installing a platform/core/tools inside the IDE:
`Error: 4 DEADLINE_EXCEEDED: context deadline exceeded`

Fix: increase the download timeout used by the IDE backend.
1) Close the Arduino IDE.
2) Edit (or create) this file:
`~/.arduinoIDE/arduino-cli.yaml`
3) Add:
```yaml
network:
  connection_timeout: 600s
```
4) Reopen Arduino IDE and retry the Boards Manager install.
(If needed, try higher values like `1200s`.)

## If upload fails due to serial permissions
1) Add your user to the serial-device group:
```bash
sudo usermod -aG dialout $USER
```
2) Log out and back in (or reboot), then try uploading again.
