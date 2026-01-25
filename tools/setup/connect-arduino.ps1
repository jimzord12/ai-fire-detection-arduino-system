<#
.SYNOPSIS
  Automates connecting an Arduino to WSL2 via usbipd-win.
  Run this from Windows PowerShell as Administrator.
#>

$TargetVID = "2341" # Arduino Vendor ID
$TargetName = "Arduino"

Write-Host "=== Arduino WSL2 Connection Helper ===" -ForegroundColor Cyan

# 1. Check if usbipd is installed
if (-not (Get-Command "usbipd" -ErrorAction SilentlyContinue)) {
    Write-Error "usbipd command not found. Please install usbipd-win."
    exit 1
}

# 2. List devices and find the Arduino
Write-Host "Searching for device (VID: $TargetVID)..."
$listOutput = usbipd list
$targetLine = $listOutput | Where-Object { $_ -match "$TargetVID" }

if (-not $targetLine) {
    Write-Warning "Arduino not found in USB list."
    Write-Host "Please ensure:"
    Write-Host "1. The Arduino is plugged in."
    Write-Host "2. You are using a data-capable USB cable."
    exit 1
}

# Extract BUSID (First column)
$busId = $targetLine.Trim().Split(" ")[0]
Write-Host "Found device at BUSID: $busId" -ForegroundColor Green

# 3. Check status
if ($targetLine -match "Attached -") {
    Write-Host "Device is already attached to WSL." -ForegroundColor Yellow
} else {
    # 4. Attach Device
    Write-Host "Attaching to WSL..."
    try {
        # Capture both stdout and stderr
        $attachOutput = usbipd attach --wsl --busid $busId 2>&1

        if ($LASTEXITCODE -eq 0) {
             Write-Host "Successfully attached." -ForegroundColor Green
        } elseif ($attachOutput -match "already attached") {
             Write-Host "⚠️  Device was already attached (detected during attach attempt)." -ForegroundColor Yellow
        } else {
             # Re-throw other errors
             throw $attachOutput
        }
    } catch {
        Write-Error "Failed to attach device. Ensure you are running as ADMINISTRATOR."
        Write-Host "Error details: $_"
        exit 1
    }
}

# 5. Verify inside WSL
Write-Host "`nVerifying inside WSL..."
wsl lsusb -d "$TargetVID`:"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Success! Arduino is visible in WSL." -ForegroundColor Green

    # Check /dev/ttyACM*
    $port = wsl ls /dev/ttyACM0 2>$null
    if ($port) {
        Write-Host "   Port: /dev/ttyACM0 found." -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Device found in lsusb, but /dev/ttyACM0 not showing yet. It might take a moment." -ForegroundColor Yellow
    }
} else {
    Write-Error "❌ Failed to verify device inside WSL."
}
