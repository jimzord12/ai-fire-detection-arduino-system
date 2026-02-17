#!/bin/bash

# Usage: ./parse_visual_aids_args.sh "3 2 1" --chapter|--images|--tables

ARGS=$1
FLAG=$2

# Split ARGS into an array
read -ra ADDR <<< "$ARGS"

CHAPTER=${ADDR[0]}
IMAGES=${ADDR[1]}
TABLES=${ADDR[2]}

case $FLAG in
    --chapter)
        echo "$CHAPTER"
        ;;
    --images)
        echo "$IMAGES"
        ;;
    --tables)
        echo "$TABLES"
        ;;
    *)
        echo "Invalid flag"
        exit 1
        ;;
esac
