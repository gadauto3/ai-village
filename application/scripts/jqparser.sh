#!/bin/bash

while IFS= read -r line; do
    echo "$line" | jq . > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        # This line is valid JSON, process or print it
        echo "$line" | jq
    fi
done
