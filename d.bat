@echo off
echo 🧹 Cleaning everything...
docker-compose down -v
docker system prune -a -f
docker builder prune -a -f

echo 📦 Rebuilding images...
docker-compose build --no-cache

echo 🚀 Starting containers...
docker-compose up -d

echo ✅ Done! Checking status...
docker ps
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Testing health endpoint...
timeout /t 3
curl http://localhost:3000/api/health