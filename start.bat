@echo off
REM Resumate AI - Docker Quick Start (Windows)

echo.
echo ========================================
echo  Resumate AI - Docker Development
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env with GEMINI_API_KEY
    echo.
    echo Example:
    echo GEMINI_API_KEY=your_api_key_here
    echo NODE_ENV=development
    pause
    exit /b 1
)

REM Check if backend .env exists
if not exist backend\.env (
    echo Creating backend\.env...
    copy .env backend\.env
)

echo.
echo 🔨 Building Docker images...
docker-compose build --pull

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to build Docker images
    pause
    exit /b 1
)

echo.
echo 🎬 Starting services...
docker-compose up -d

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo ========================================
echo  ✅ Resumate AI is running!
echo ========================================
echo.
echo 📊 URLs:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000/api
echo   Nginx:     http://localhost
echo.
echo 📋 Docker Commands:
echo   View all logs:  docker-compose logs -f
echo   View backend:   docker-compose logs -f backend
echo   View frontend:  docker-compose logs -f frontend
echo   Restart:        docker-compose restart
echo   Stop:           docker-compose down
echo.
echo 📝 Note: Press Ctrl+C to stop Docker
echo.

docker-compose ps
echo.
