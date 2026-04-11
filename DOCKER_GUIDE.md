# 🐳 Resumate AI - Docker Setup Guide

## Prerequisites

- **Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
- **Node.js** - v18 or higher (for development)
- **Git** - For version control
- **Gemini API Key** - Get from [Google Cloud Console](https://console.cloud.google.com/)

---

## Local Development with Docker

### **1. Clone Repository**

```bash
git clone https://github.com/YOUR_USERNAME/resumate-ai.git
cd resumate-ai
```

### **2. Create Environment Files**

Create `.env` in root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

Create `backend/.env`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=5000
```

### **3. Start Development Environment**

**Windows (PowerShell):**
```powershell
.\start.bat
```

**Mac/Linux (Bash):**
```bash
chmod +x start.sh
./start.sh
```

**Or manually with Docker:**
```bash
docker-compose up -d
```

### **4. Access the Application**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Nginx (Production setup):** http://localhost

---

## Docker Commands

### **View Logs**

```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### **Stop Services**

```bash
# Stop but keep data
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers, and volumes
docker-compose down -v
```

### **Rebuild Containers**

```bash
# Build new images
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache
```

### **Individual Service Management**

```bash
# Restart specific service
docker-compose restart backend

# View service logs
docker-compose logs backend

# Execute command in container
docker-compose exec backend npm list

# Open shell in container
docker-compose exec backend sh
```

---

## Production Deployment

For production deployment on a VPS, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## File Structure

```
resumate-ai/
├── Dockerfile.frontend          # Frontend production image
├── backend/
│   ├── Dockerfile              # Backend production image
│   ├── package.json
│   ├── server.js
│   └── ...
├── docker-compose.yml          # Development setup
├── nginx.conf                  # Reverse proxy config
├── .env                        # Environment variables
├── .dockerignore               # Docker build exclusions
├── start.sh                    # Linux/Mac startup script
├── start.bat                   # Windows startup script
└── ...
```

---

## Troubleshooting

### **Port Already in Use**

```bash
# Find process using port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 PID  # Mac/Linux
taskkill /PID PID /F  # Windows
```

### **Container Won't Start**

```bash
# Check logs
docker-compose logs backend

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### **API Connection Issues**

Ensure `VITE_API_URL` in `.env` matches your setup:
- Local: `http://localhost:5000/api`
- Docker: `http://backend:5000/api` (internal)
- Production: `https://yourdomain.com/api`

### **Volume Permission Issues**

```bash
# Fix upload directory permissions
docker-compose exec backend chmod -R 755 uploads

# Or recreate volume
docker-compose down -v
docker-compose up -d
```

---

## Performance Tips

1. **Use BuildKit for faster builds:**
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose build
   ```

2. **Limit memory usage:**
   Edit `docker-compose.yml` and add:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 512M
   ```

3. **Clean up unused images:**
   ```bash
   docker system prune -a
   ```

---

## Security Tips

1. Never commit `.env` to git
2. Use unique API keys per environment
3. Regularly update Docker images:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
4. Monitor logs for errors:
   ```bash
   docker-compose logs --follow
   ```

---

## Next Steps

- 🚀 [Deploy to VPS](./DEPLOYMENT_GUIDE.md)
- 📚 [Docker Documentation](https://docs.docker.com/)
- 🔧 [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

## Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify `.env` files exist and have correct values
3. Ensure Docker is running and has enough resources
4. Try rebuilding: `docker-compose down -v && docker-compose up -d --build`

Happy coding! 🎉
