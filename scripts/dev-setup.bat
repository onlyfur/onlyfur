@echo off
REM OnlyFur Platform Development Startup Script for Windows

echo 🚀 Starting OnlyFur Platform Development Environment...

REM Check if .env.local exists, if not copy from .env.development
if not exist .env.local (
    echo 📄 Creating .env.local from .env.development...
    copy .env.development .env.local
    echo ⚠️  Please update .env.local with your actual API keys and database credentials
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run prisma:generate

echo ✅ Development environment ready!
echo.
echo To start the application:
echo 1. Terminal 1: npm run server:dev  (Backend API server)
echo 2. Terminal 2: npm run dev         (Frontend development server)
echo.
echo The application will be available at:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001
echo.
echo If you encounter CORS errors, make sure both servers are running.

pause
