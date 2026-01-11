#!/bin/bash
# automated_data_collection.sh
# Usage: ./automated_data_collection.sh <label> <samples> <duration>

LABEL=$1
NUM_SAMPLES=$2
DURATION=$3  # seconds per sample
SERIAL_PORT="/dev/ttyACM0"

# Validate inputs
if [ -z "$LABEL" ] || [ -z "$NUM_SAMPLES" ] || [ -z "$DURATION" ]; then
    echo "Usage: $0 <label> <num_samples> <duration_seconds>"
    echo "Example: $0 normal 100 10"
    exit 1
fi

# Create data directory
mkdir -p data/$LABEL

echo "=== Automated Data Collection ==="
echo "Label: $LABEL"
echo "Samples: $NUM_SAMPLES"
echo "Duration: ${DURATION}s per sample"
echo "Output: data/$LABEL/"
echo ""

for i in $(seq 1 $NUM_SAMPLES); do
    FILENAME="data/${LABEL}/${LABEL}_$(date +%Y%m%d_%H%M%S)_${i}.csv"

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
echo "Files: $(ls -1 data/$LABEL/*.csv | wc -l)"
echo ""
echo "Upload to Edge Impulse with:"
echo "  edge-impulse-uploader --category training --label $LABEL data/$LABEL/*.csv"
