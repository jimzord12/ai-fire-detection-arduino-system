#!/usr/bin/env bash

# gemini3-yolo.sh
# Run Gemini CLI with Gemini 3 Flash + YOLO mode

gemini \
  --model gemini-3-flash \
  --yolo \
  "$@"
