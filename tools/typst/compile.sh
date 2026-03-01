#!/bin/bash

# Navigate to project root if script is run from tools/typst
cd "$(dirname "$0")/../.."

echo "Compiling Typst thesis..."
typst compile thesis/typst/main.typ
echo "Done."
