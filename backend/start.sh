#!/bin/bash

# Business Finder Backend Startup Script

echo "🚀 Starting Business Finder Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your GOOGLE_PLACES_API_KEY"
    echo "   Get your free API key from: https://console.cloud.google.com/"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start server
echo "✅ Starting Flask server..."
echo "📍 Server will be available at: http://localhost:5000"
echo ""
python app.py
