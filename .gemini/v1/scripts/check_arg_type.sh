#!/bin/bash

arg="$1"

# Regex for a single item (a number like 5 or a range like 7-9)
item="[0-9]+(-[0-9]+)?"

if [ "$arg" == "all" ]; then
    echo "all"
elif [[ "$arg" =~ ^[0-9]+$ ]]; then
    echo "number"
elif [[ "$arg" =~ ^[0-9]+-[0-9]+$ ]]; then
    echo "range"
# Matches: item, followed by one or more (comma + optional space + item)
elif [[ "$arg" =~ ^$item(,[[:space:]]*$item)+$ ]]; then
    echo "list"
else
    echo "invalid"
fi
