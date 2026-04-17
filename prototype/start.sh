#!/usr/bin/env bash

echo "Starting DESNZ CPO Prototype..."
echo "A browser window should open shortly. If not, go to http://localhost:8080"
echo "Press Ctrl+C to stop the server."
echo ""

# Try to open the default browser (Mac)
open "http://localhost:8080" 2>/dev/null

# Start the simple python http server
python3 -m http.server 8080
