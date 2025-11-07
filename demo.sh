#!/bin/bash

# Demo script for Detection History App

echo "🎬 Starting Detection History App Demo..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create uploads directory
mkdir -p uploads

echo ""
echo "🧪 Running API tests..."
node test-api.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ API tests passed! Starting application..."
    echo ""
    echo "🌐 The application will be available at: http://localhost:3000"
    echo "📝 Features to test:"
    echo "   1. Upload an image and analyze it"
    echo "   2. View detection results"
    echo "   3. Navigate to History page"
    echo "   4. Click on detection items to view details"
    echo "   5. Clear history functionality"
    echo ""
    echo "🔄 Press Ctrl+C to stop the server"
    echo ""
    
    # Start the server
    npm start
else
    echo "❌ API tests failed. Please check the errors above."
    exit 1
fi