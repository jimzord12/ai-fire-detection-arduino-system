#!/bin/bash
# upload_all_to_edge_impulse.sh
# Convenience script to upload all CSVs under data/raw using upload_to_edge_impulse.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_ROOT="${SCRIPT_DIR}/../../data/raw"
UPLOAD_SCRIPT="${SCRIPT_DIR}/upload_to_edge_impulse.sh"

if [ ! -x "$UPLOAD_SCRIPT" ]; then
    echo "Error: upload script not found or not executable: $UPLOAD_SCRIPT"
    exit 1
fi

if [ ! -d "$DATA_ROOT" ]; then
    echo "Error: data directory not found: $DATA_ROOT"
    exit 1
fi

shopt -s nullglob

for labeldir in "$DATA_ROOT"/*; do
    [ -d "$labeldir" ] || continue
    label="$(basename "$labeldir")"

    files=("$labeldir"/*.csv)
    if (( ${#files[@]} )); then
        yes | "$UPLOAD_SCRIPT" "$label" || exit 1
    fi

    for scenariodir in "$labeldir"/*; do
        [ -d "$scenariodir" ] || continue
        sfiles=("$scenariodir"/*.csv)
        if (( ${#sfiles[@]} )); then
            scenario="$(basename "$scenariodir")"
            yes | "$UPLOAD_SCRIPT" "$label" "$scenario" || exit 1
        fi
    done
done
