#!/bin/bash

# If no arguments are provided, default to typst/main.typ
SOURCE=${1:-"typst/main.typ"}
OUTPUT=$2

if [ -z "$OUTPUT" ]; then
    echo "Compiling $SOURCE..."
    typst compile "$SOURCE"
else
    echo "Compiling $SOURCE to $OUTPUT..."
    typst compile "$SOURCE" "$OUTPUT"
fi
