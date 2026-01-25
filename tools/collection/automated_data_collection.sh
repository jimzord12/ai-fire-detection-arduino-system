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

# Verify Serial Port
if [ ! -e "$SERIAL_PORT" ]; then
    echo "❌ Error: Serial port '$SERIAL_PORT' not found."
    echo "   -> Please check if the Arduino is connected via USB."
    echo "   -> If it's on a different port, update the SERIAL_PORT variable in this script."
    exit 1
fi

if [ ! -r "$SERIAL_PORT" ]; then
    echo "❌ Error: No permission to read '$SERIAL_PORT'."
    echo "   -> Try running: sudo chmod a+rw $SERIAL_PORT"
    echo "   -> Or add your user to the dialout group: sudo usermod -a -G dialout $USER (requires logout)"
    exit 1
fi

# Check if port is accessible (not busy)
if ! stty -F "$SERIAL_PORT" &>/dev/null; then
    echo "⚠️  Warning: Unable to access '$SERIAL_PORT'. It might be busy (e.g., Serial Monitor open)."
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Set Baud Rate and raw mode
stty -F "$SERIAL_PORT" 115200 raw -echo

# Create data directory relative to script location
if [ -n "$SCENARIO" ]; then
    DATA_DIR="${SCRIPT_DIR}/../../data/raw/${LABEL}/${SCENARIO}"
    FILE_PREFIX="${LABEL}__${SCENARIO}"
else
    DATA_DIR="${SCRIPT_DIR}/../../data/raw/${LABEL}"
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
    # CSV Columns: timestamp, smoke, voc, co, flame, temperature, humidity
    echo "timestamp,smoke,voc,co,flame,temperature,humidity" > "$FILENAME"

    # Skip first line (likely partial), keep only valid 7-column rows (timestamp + 6 sensors)
    tail -n +2 "$TEMP_FILE" | awk -F',' 'NF==7 {printf "%s\n", $0}' >> "$FILENAME"

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
    echo "  ${SCRIPT_DIR}/../integration/upload_to_edge_impulse.sh $LABEL $SCENARIO"
else
    echo "Upload to Edge Impulse with:"
    echo "  ${SCRIPT_DIR}/../integration/upload_to_edge_impulse.sh $LABEL"
fi
