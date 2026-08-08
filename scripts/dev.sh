#!/bin/bash

# Script to start both frontend and backend development servers

echo "Starting EcoCycle development environment..."

# Start backend server in background
echo "Starting backend server..."
npm start &

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev

# Kill background processes when frontend is stopped
trap 'kill $(jobs -p)' EXIT