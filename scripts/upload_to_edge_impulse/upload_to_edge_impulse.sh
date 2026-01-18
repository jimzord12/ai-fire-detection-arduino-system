#!/bin/bash
# upload_to_edge_impulse.sh
# Uploads collected CSV samples to Edge Impulse Cloud

# Get the directory where THIS script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
LABEL=$1
SCENARIO=$2
CATEGORY="${3:-training}"  # Default to 'training' if not specified

# Validate inputs
if [ -z "$LABEL" ]; then
    echo "Usage: $0 <label> [scenario] [category]"
    echo ""
    echo "Arguments:"
    echo "  label     - Label/class name (e.g., fire, no_fire, false_alarm)"
    echo "  scenario  - Optional scenario subdirectory (e.g., base_room_air)"
    echo "  category  - Data category: 'training' or 'testing' (default: training)"
    echo ""
    echo "Examples:"
    echo "  $0 fire                              # Upload all files from data/fire/"
    echo "  $0 no_fire base_room_air            # Upload data/no_fire/base_room_air/"
    echo "  $0 fire close_low_vent testing      # Upload to testing set"
    exit 1
fi

# Validate category
if [ "$CATEGORY" != "training" ] && [ "$CATEGORY" != "testing" ]; then
    echo "Error: Category must be 'training' or 'testing'"
    exit 1
fi

# Determine data directory
if [ -n "$SCENARIO" ]; then
    DATA_DIR="${SCRIPT_DIR}/../../data/${LABEL}/${SCENARIO}"
else
    DATA_DIR="${SCRIPT_DIR}/../../data/${LABEL}"
fi

# Check if directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo "Error: Directory does not exist: $DATA_DIR"
    exit 1
fi

# Count CSV files
CSV_COUNT=$(ls -1 ${DATA_DIR}/*.csv 2>/dev/null | wc -l)
if [ $CSV_COUNT -eq 0 ]; then
    echo "Error: No CSV files found in $DATA_DIR"
    exit 1
fi

# Check if edge-impulse-uploader is installed
if ! command -v edge-impulse-uploader &> /dev/null; then
    echo "Error: edge-impulse-uploader not found"
    echo "Install with: npm install -g edge-impulse-cli"
    exit 1
fi

echo "=== Edge Impulse Upload ==="
echo "Label: $LABEL"
if [ -n "$SCENARIO" ]; then
    echo "Scenario: $SCENARIO"
fi
echo "Category: $CATEGORY"
echo "Files: $CSV_COUNT CSV files"
echo "Source: $DATA_DIR"
echo ""

read -p "Continue with upload? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Upload cancelled."
    exit 0
fi

# Upload files
echo ""
echo "Uploading..."
UPLOAD_OUTPUT=$(edge-impulse-uploader \
    --category "$CATEGORY" \
    --label "$LABEL" \
    ${DATA_DIR}/*.csv 2>&1)

echo "$UPLOAD_OUTPUT"

# Check for failures in output (edge-impulse-uploader may exit 0 even with failures)
FAILED_COUNT=$(echo "$UPLOAD_OUTPUT" | grep -c "Failed to upload" || true)
SUCCESS_LINE=$(echo "$UPLOAD_OUTPUT" | grep "Files uploaded successful" || true)

echo ""
if [ "$FAILED_COUNT" -gt 0 ]; then
    echo "❌ Upload failed: $FAILED_COUNT file(s) could not be uploaded."
    echo "Check the output above for details."
    exit 1
elif [ -n "$SUCCESS_LINE" ]; then
    echo "✅ Upload complete!"
    echo "View your data at: https://studio.edgeimpulse.com"
else
    echo "⚠️  Upload status unclear. Check the output above."
    exit 1
fi
