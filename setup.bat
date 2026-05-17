@echo off
REM InfiQ Setup Script for Windows

echo 🚀 Setting up InfiQ...

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

echo ✅ Node.js version:
node -v

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local...
    copy .env.example .env.local
    echo ⚠️  Please update .env.local with your API keys
)

REM Create reports directory
if not exist public\reports mkdir public\reports

echo ✅ Setup complete!
echo.
echo 🎉 Next steps:
echo 1. Update .env.local with your API keys
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
