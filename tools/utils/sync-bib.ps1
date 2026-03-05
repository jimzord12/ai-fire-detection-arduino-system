# sync-bib.ps1: Consolidates section-level bibliography files into the global thesis bibliography.

$BIB_TARGET = "thesis/typst/bibliography.bib"
$CHAPTERS_DIR = "thesis/typst/chapters"

Write-Host "Syncing and deduplicating bibliography..."

# Add a header
$Header = "% Global Bibliography - Auto-generated from section-level references.bib files`r`n" +
          "% Generated on: $(Get-Date)`r`n`r`n"

$Refs = Get-ChildItem -Path $CHAPTERS_DIR -Filter "references.bib" -Recurse | Get-Content -Raw

# Simple BibTeX entry extractor and deduplicator
$AllEntries = @()
$SeenKeys = @{}

foreach ($Content in $Refs) {
    # Split entries by '@'
    $Entries = $Content -split '@'
    foreach ($Entry in $Entries) {
        if ($Entry -match '^\w+{([^,]+),') {
            $Key = $Matches[1].Trim()
            if (-not $SeenKeys.ContainsKey($Key)) {
                $SeenKeys[$Key] = $true
                $AllEntries += "@" + $Entry.Trim() + "`r`n`r`n"
            }
        }
    }
}

$FinalContent = $Header + ($AllEntries -join "")
Set-Content -Path $BIB_TARGET -Value $FinalContent

Write-Host "Done! $BIB_TARGET has been updated and deduplicated."
