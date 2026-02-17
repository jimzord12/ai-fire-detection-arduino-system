#!/usr/bin/env bash

# Image Generation Shell Script
# Wrapper for the TypeScript image generation tool

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if npx and tsx are available
if ! command -v npx &> /dev/null; then
    echo "Error: npx is not installed. Please install Node.js first."
    exit 1
fi

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: $(basename "$0") <prompt-file> [output-path] [options]"
    echo ""
    echo "Arguments:"
    echo "  <prompt-file>   Path to a text file containing the image prompt"
    echo "  [output-path]   Output path for the generated image (default: out.png)"
    echo ""
    echo "Options:"
    echo "  -m, --model <model>         OpenRouter model ID"
    echo "  -a, --aspect-ratio <ratio>  Aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4)"
    echo "  -s, --image-size <size>     Image size (1K, 2K, 4K) - Gemini only"
    echo ""
    echo "Examples:"
    echo "  $(basename "$0") prompt.txt output.png"
    echo "  $(basename "$0") prompt.txt output.png --aspect-ratio 16:9"
    echo "  $(basename "$0") prompt.txt output.png -m google/gemini-2.5-flash-image-preview"
    exit 1
fi

# Run the TypeScript script with tsx
cd "$SCRIPT_DIR"
npx tsx image-gen.ts "$@"
