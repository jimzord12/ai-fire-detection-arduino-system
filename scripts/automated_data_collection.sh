#!/bin/bash
# automated_data_collection.sh (improved version)

# Get the directory where THIS script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
LABEL=$1
NUM_SAMPLES=$2
DURATION=$3
SCENARIO=$4
SERIAL_PORT="/dev/ttyACM0"

# Validate inputs
if [ -z "$LABEL" ] || [ -z "$NUM_SAMPLES" ] || [ -z "$DURATION" ]; then
    echo "Usage: $0 <label> <num_samples> <duration_seconds> [scenario]"
    echo "Example: $0 no_fire 100 10"
    echo "Example with scenario: $0 no_fire 30 10 base_room_air"
    exit 1
fi

# Create data directory relative to script location
if [ -n "$SCENARIO" ]; then
    DATA_DIR="${SCRIPT_DIR}/../data/${LABEL}/${SCENARIO}"
    FILE_PREFIX="${LABEL}__${SCENARIO}"
else
    DATA_DIR="${SCRIPT_DIR}/../data/${LABEL}"
    FILE_PREFIX="${LABEL}"
fi
mkdir -p "$DATA_DIR"

echo "=== Automated Data Collection ==="
echo "Label: $LABEL"
if [ -n "$SCENARIO" ]; then
    echo "Scenario: $SCENARIO"
fi
echo "Samples: $NUM_SAMPLES"
echo "Duration: ${DURATION}s per sample"
echo "Output: $DATA_DIR/"
echo "Working from: $(pwd)"
echo ""

for i in $(seq 1 $NUM_SAMPLES); do
    FILENAME="${DATA_DIR}/${FILE_PREFIX}_$(date +%Y%m%d_%H%M%S)_${i}.csv"
    TEMP_FILE=$(mktemp)

    echo -n "[$i/$NUM_SAMPLES] Collecting... "

    # Capture serial data to temp file
    timeout ${DURATION}s cat $SERIAL_PORT > "$TEMP_FILE"

    # Add CSV header with timestamp (Edge Impulse requires timestamp for time-series)
    echo "timestamp,voc,smoke,flame,co,temp,humid" > "$FILENAME"

    # Skip first line (likely partial), keep only valid 6-column rows, and add timestamp (100ms intervals)
    tail -n +2 "$TEMP_FILE" | awk -F',' 'NF==6 {printf "%d,%s\n", (NR-1)*100, $0}' >> "$FILENAME"

    rm "$TEMP_FILE"

    # Verify file has valid data (header + at least 1 data row)
    LINE_COUNT=$(wc -l < "$FILENAME")
    if [ $LINE_COUNT -gt 1 ]; then
        echo "✅ Saved ($((LINE_COUNT - 1)) data rows)"
    else
        echo "❌ Failed (no valid data)"
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
if [ -n "$SCENARIO" ]; then
    echo "Upload to Edge Impulse with:"
    echo "  cd $SCRIPT_DIR"
    echo "  edge-impulse-uploader --category training --label $LABEL data/$LABEL/$SCENARIO/*.csv"
else
    echo "Upload to Edge Impulse with:"
    echo "  cd $SCRIPT_DIR"
    echo "  edge-impulse-uploader --category training --label $LABEL data/$LABEL/*.csv"
fi
