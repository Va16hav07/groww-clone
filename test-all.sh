#!/bin/bash
echo "Ensuring Docker is up..."
docker compose up -d

echo "Starting Gateway..."
node gateway/server.js &
GATEWAY_PID=$!

echo "Starting Backend..."
node src/server.js &
BACKEND_PID=$!

echo "Waiting for servers to initialize..."
sleep 15

echo "--- Running Streaming Test ---"
node test-stream.js

echo "--- Running Orders Test ---"
node test-orders.js

echo "--- Cleaning up processes ---"
kill -9 $GATEWAY_PID
kill -9 $BACKEND_PID

echo "Finished E2E Tests."
