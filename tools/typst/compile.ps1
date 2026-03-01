# Navigate to project root if script is run from tools/typst
Set-Location "$PSScriptRoot\..\.."

Write-Host "Compiling Typst thesis..."
typst compile thesis/typst/main.typ
Write-Host "Done."
