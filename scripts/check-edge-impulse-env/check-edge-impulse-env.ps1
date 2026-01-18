<#
.SYNOPSIS
  Corrected environment check for Edge Impulse + Arduino UNO R4.
#>

Write-Host "=== Edge Impulse + Arduino UNO R4 Environment Check (Corrected) ===`n" -ForegroundColor Cyan

# Fixed Helper Function
function Test-Command($cmd) {
    return (Get-Command $cmd -ErrorAction SilentlyContinue) -ne $null
}

$results = @()

# 1. Node.js
Write-Host "[1/6] Checking Node.js..."
$nodeInfo = [ordered]@{ Name = "Node.js"; Status = "MISSING"; Details = ""; InstallHint = "" }
if (Test-Command "node") {
    $nodeInfo.Status = "FOUND"
    $nodeInfo.Details = "Version: $(node --version)"
} else {
    $nodeInfo.InstallHint = "Download LTS from https://nodejs.org. Ensure 'Add to PATH' is checked."
}
$results += New-Object psobject -Property $nodeInfo

# 2. npm
Write-Host "[2/6] Checking npm..."
$npmInfo = [ordered]@{ Name = "npm"; Status = "MISSING"; Details = ""; InstallHint = "" }
if (Test-Command "npm") {
    $npmInfo.Status = "FOUND"
    $npmInfo.Details = "Version: $(npm -v)"
} else {
    $npmInfo.InstallHint = "npm usually comes with Node.js. Reinstall Node.js if missing."
}
$results += New-Object psobject -Property $npmInfo

# 3. Python 3
Write-Host "[3/6] Checking Python 3..."
$pyInfo = [ordered]@{ Name = "Python 3"; Status = "MISSING"; Details = ""; InstallHint = "" }
$pythonCmd = $null
if (Test-Command "python") { $pythonCmd = "python" }
elseif (Test-Command "python3") { $pythonCmd = "python3" }

if ($pythonCmd) {
    $ver = & $pythonCmd --version 2>&1
    $pyInfo.Status = "FOUND"
    $pyInfo.Details = "Command: $pythonCmd ($ver)"
} else {
    $pyInfo.InstallHint = "Install from https://www.python.org/. CRITICAL: Check 'Add Python to PATH' during install."
}
$results += New-Object psobject -Property $pyInfo

# 4. Edge Impulse CLI
Write-Host "[4/6] Checking Edge Impulse CLI..."
$eiInfo = [ordered]@{ Name = "Edge Impulse CLI"; Status = "MISSING"; Details = ""; InstallHint = "" }
if (Test-Command "edge-impulse-data-forwarder") {
    $eiInfo.Status = "FOUND"
    $eiInfo.Details = "Data Forwarder is available in PATH."
} else {
    $eiInfo.InstallHint = "Run: npm install -g edge-impulse-cli"
}
$results += New-Object psobject -Property $eiInfo

# 5. VS Build Tools (Specifically checking for C++ compiler)
Write-Host "[5/6] Checking VS Build Tools (C++ Workload)..."
$vsInfo = [ordered]@{ Name = "VS Build Tools (C++)"; Status = "MISSING"; Details = ""; InstallHint = "" }
$vswhere = "${Env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

if (Test-Path $vswhere) {
    # This specific flag checks for the C++ compiler tools
    $path = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    if ($path) {
        $vsInfo.Status = "FOUND"
        $vsInfo.Details = "C++ Build Tools found at: $path"
    } else {
        $vsInfo.Details = "Visual Studio is installed, but the 'Desktop development with C++' workload is missing."
    }
}

if ($vsInfo.Status -eq "MISSING") {
    $vsInfo.InstallHint = "Open 'Visual Studio Installer', click 'Modify', and check 'Desktop development with C++'."
}
$results += New-Object psobject -Property $vsInfo

# 6. Arduino IDE
Write-Host "[6/6] Checking Arduino IDE..."
$arduinoInfo = [ordered]@{ Name = "Arduino IDE"; Status = "MISSING"; Details = ""; InstallHint = "" }
$commonPaths = @(
    "$Env:LocalAppdata\Programs\Arduino IDE\Arduino IDE.exe",
    "$Env:ProgramFiles\Arduino IDE\Arduino IDE.exe",
    "C:\Program Files (x86)\Arduino\Arduino.exe"
)
foreach ($p in $commonPaths) {
    if (Test-Path $p) {
        $arduinoInfo.Status = "FOUND"
        $arduinoInfo.Details = "Found at: $p"
        break
    }
}
if ($arduinoInfo.Status -eq "MISSING") {
    $arduinoInfo.InstallHint = "Download from https://www.arduino.cc/en/software."
}
$results += New-Object psobject -Property $arduinoInfo

# Final Output
Write-Host "`n=== FINAL SUMMARY ===" -ForegroundColor Cyan
foreach ($r in $results) {
    $color = if ($r.Status -eq "FOUND") { "Green" } else { "Yellow" }
    Write-Host "[$($r.Name)]" -ForegroundColor White
    Write-Host "  Status : $($r.Status)" -ForegroundColor $color
    if ($r.Details) { Write-Host "  Details: $($r.Details)" }
    if ($r.Status -ne "FOUND") { Write-Host "  How to Get: $($r.InstallHint)" -ForegroundColor Cyan }
    Write-Host ""
}
