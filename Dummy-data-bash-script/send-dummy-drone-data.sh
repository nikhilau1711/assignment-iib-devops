#!/bin/bash

URL="http://localhost:3000/telemetry"
DRONE_ID="TEST001"

while true; do
  LAT=$(awk -v min=12.90 -v max=12.99 'BEGIN{srand(); printf "%.6f", min+rand()*(max-min)}')
  LON=$(awk -v min=77.50 -v max=77.65 'BEGIN{srand(); printf "%.6f", min+rand()*(max-min)}')
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  JSON=$(cat <<EOF
{
  "droneId": "$DRONE_ID",
  "latitude": $LAT,
  "longitude": $LON,
  "timestamp": "$TIMESTAMP"
}
EOF
)

  echo "Sending telemetry: $JSON"
  curl -s -X POST "$URL" \
    -H "Content-Type: application/json" \
    -d "$JSON"

  sleep 5
done

