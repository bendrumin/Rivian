#!/bin/bash

echo "🚀 Setting up Rivian News Tracker..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local from env.example"
    echo "⚠️  Please update .env.local with your Supabase database password!"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase database password"
echo "2. Run: npx prisma db push (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo ""
echo "Your Supabase project details:"
echo "URL: https://npyovadmjolgxlayhsnc.supabase.co"
echo "Project ID: npyovadmjolgxlayhsnc"
echo ""
