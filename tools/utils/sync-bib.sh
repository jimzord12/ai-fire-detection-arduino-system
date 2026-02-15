#!/bin/bash
# sync-bib.sh: Consolidates section-level bibliography files into the global thesis bibliography.

# Configuration
BIB_TARGET="thesis/typst/bibliography.bib"
CHAPTERS_DIR="thesis/typst/chapters"
TEMP_BIB=$(mktemp)

echo "Syncing and deduplicating bibliography..."

# Add a header
echo "% Global Bibliography - Auto-generated from section-level references.bib files" > "$TEMP_BIB"
echo "% Generated on: $(date)" >> "$TEMP_BIB"
echo "" >> "$TEMP_BIB"

# Find all references.bib files and collect entries
# We use a simple awk script to extract entries and keep only unique ones based on the key.
# This is a basic deduplication that assumes standard BibTeX format.
find "$CHAPTERS_DIR" -name "references.bib" -print0 | xargs -0 cat | awk '
BEGIN { RS = "@"; FS = "{" }
NR > 1 {
    key = $2
    sub(/,.*/, "", key)
    # Trim whitespace from key
    gsub(/^[ \t\n\r]+|[ \t\n\r]+$/, "", key)
    if (!seen[key]++) {
        printf "@%s", $0
    }
}
' >> "$TEMP_BIB"

# Replace the target bibliography
mv "$TEMP_BIB" "$BIB_TARGET"

echo "Done! $BIB_TARGET has been updated and deduplicated."
