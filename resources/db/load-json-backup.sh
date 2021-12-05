#!/bin/bash

export TABLE_NAME=$1
export SCAN_OUTPUT_FILE=$2

if [[ -z "$TABLE_NAME" ]]; then
    echo "missing a parameter"
    exit 1
fi
if [[ -z "$SCAN_OUTPUT_FILE" ]]; then
    echo "missing a parameter"
    exit 1
fi

node makeBatch.js

aws dynamodb batch-write-item --request-items file://bounties_0.json
aws dynamodb batch-write-item --request-items file://bounties_1.json
aws dynamodb batch-write-item --request-items file://bounties_2.json