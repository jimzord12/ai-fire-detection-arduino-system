#!/bin/bash
# automated_data_collection.sh (improved version)

# Get the directory where THIS script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
LABEL=$1
NUM_SAMPLES=$2
DURATION=$3
SERIAL_PORT="/dev/ttyACM0"

# Validate inputs
if [ -z "$LABEL" ] || [ -z "$NUM_SAMPLES" ] || [ -z "$DURATION" ]; then
    echo "Usage: $0 <label> <num_samples> <duration_seconds>"
    echo "Example: $0 normal 100 10"
    exit 1
fi

# Create data directory relative to script location
DATA_DIR="${SCRIPT_DIR}/data/${LABEL}"
mkdir -p "$DATA_DIR"

echo "=== Automated Data Collection ==="
echo "Label: $LABEL"
echo "Samples: $NUM_SAMPLES"
echo "Duration: ${DURATION}s per sample"
echo "Output: $DATA_DIR/"
echo "Working from: $(pwd)"
echo ""

for i in $(seq 1 $NUM_SAMPLES); do
    FILENAME="${DATA_DIR}/${LABEL}_$(date +%Y%m%d_%H%M%S)_${i}.csv"

    echo -n "[$i/$NUM_SAMPLES] Collecting... "

    # Add CSV header
    echo "timestamp,voc,smoke,flame,co,temp,humid" > "$FILENAME"

    # Capture serial data
    timeout ${DURATION}s cat $SERIAL_PORT >> "$FILENAME"

    # Verify file has data
    LINE_COUNT=$(wc -l < "$FILENAME")
    if [ $LINE_COUNT -gt 1 ]; then
        echo "✅ Saved ($LINE_COUNT lines)"
    else
        echo "❌ Failed (no data)"
        rm "$FILENAME"
    fi

    # Pause between samples
    sleep 2
done

echo ""
echo "=== Collection Complete ==="
echo "Files: $(ls -1 ${DATA_DIR}/*.csv 2>/dev/null | wc -l)"
echo "Location: $DATA_DIR"
echo ""
echo "Upload to Edge Impulse with:"
echo "  cd $SCRIPT_DIR"
echo "  edge-impulse-uploader --category training --label $LABEL data/$LABEL/*.csv"
