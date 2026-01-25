Arduino IDE 2 works on Ubuntu 24.04, but the Linux AppImage commonly fails to start until FUSE 2 compatibility is installed (on 24.04 that package is `libfuse2t64`).

## Install (recommended AppImage path)
1) Enable Universe (if it isn’t already):  
```bash
sudo add-apt-repository universe
sudo apt update
```  
Universe is commonly required to find packages like `libfuse2t64` on Ubuntu.

2) Install FUSE 2 compatibility for AppImages:  
```bash
sudo apt install libfuse2t64
```  
AppImage docs note that in Ubuntu 24.04 `libfuse2` was renamed to `libfuse2t64`. 

3) Make the AppImage executable and run it:  
```bash
cd ~/Downloads
chmod +x arduino-ide_2.3.7_Linux_64bit.AppImage
./arduino-ide_2.3.7_Linux_64bit.AppImage
```  
AppImages must be executable, and running from terminal helps reveal any runtime error output.

## If it still won’t open
- Sandbox error / instant exit: try launching with `--no-sandbox` (some Electron apps need this on locked-down setups).  
```bash
./arduino-ide_2.3.7_Linux_64bit.AppImage --no-sandbox
```  
This is a common workaround when Electron-based AppImages don’t start properly.

- If you installed new groups/permissions (rare for this case), log out and back in so group membership takes effect. 

## No-FUSE fallback (last resort)
If you can’t (or don’t want to) set up FUSE, AppImage supports “extract-and-run”:  
```bash
./arduino-ide_2.3.7_Linux_64bit.AppImage --appimage-extract-and-run
```  
AppImage’s troubleshooting guide documents this fallback when FUSE can’t be made to work.
## Serial port permission (when uploading)
If the IDE opens but uploads fail due to permission errors, add your user to the `dialout` group and re-login:  
```bash
sudo usermod -aG dialout $USER
```  
Ubuntu’s Arduino guide calls out `dialout` as the group typically needed for access to Arduino serial devices. 
