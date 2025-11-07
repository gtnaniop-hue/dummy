#!/bin/bash

# Detection History App Start Script

echo "🚀 Starting Detection History App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if uploads directory exists, create if not
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads
fi

# Start the server
echo "🌐 Starting server on http://localhost:3000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start