#!/bin/bash

# Smart Bookmark App - Quick Setup Script
# This script helps you get started with the application

echo "🚀 Smart Bookmark App - Setup Assistant"
echo "========================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local file found"
else
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.local.example .env.local
    echo "📝 Please edit .env.local and add your Supabase credentials"
    echo "   You can find them in your Supabase project settings > API"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Testing build..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you've set up Supabase (see SUPABASE_SETUP.md)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Test the application locally before deploying"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
