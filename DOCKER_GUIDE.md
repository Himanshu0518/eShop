# 🐳 Docker Deployment Guide

## 📋 Overview

This guide covers building and deploying the eShop application using Docker and Docker Compose.

---

## 🏗️ Project Structure

```
eShop/
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── .env                        # Environment variables (root)
├── server/
│   ├── Dockerfile             # Backend container
│   ├── .dockerignore
│   └── .env                   # Backend env (local dev)
└── client/
    ├── Dockerfile             # Frontend container
    ├── nginx.conf             # Nginx configuration
    ├── .dockerignore
    └── .env                   # Frontend env (local dev)
```

---

## 🔧 Prerequisites

- Docker Desktop installed
- Docker Compose v3.8+
- Node.js 22+ (for local development)
- pnpm (for local development)

---

## 📦 Building Docker Images

### **Backend Image**

```bash
cd server
docker build -t himanshu0518/backend:latest .
```

**What happens:**
1. ✅ Copies package files
2. ✅ Installs dependencies (skips postinstall)
3. ✅ Copies application code
4. ✅ Exposes port 8000
5. ⏳ Runs `prisma generate` at runtime

### **Frontend Image**

```bash
cd client
docker build -t himanshu0518/frontend:latest .
```

**What happens:**
1. ✅ Stage 1: Builds React app with Vite
2. ✅ Stage 2: Serves with Nginx
3. ✅ Configures reverse proxy for /api
4. ✅ Enables gzip compression

---

## 🚀 Running with Docker Compose

### **Development Mode**

```bash
# From project root
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:80
- Backend: http://localhost:8000

### **Production Mode**

```bash
# From project root
docker-compose -f docker-compose.prod.yml up -d
```

### **View Logs**

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### **Stop Services**

```bash
docker-compose down
```

### **Restart Services**

```bash
docker-compose restart
```

---

## 🔐 Environment Variables

### **Required Variables (.env in root)**

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=8000
JWT_SECRET=your_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI
GEMINI_API_KEY=your_gemini_key

# Payment
USD_TO_INR=83
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET_KEY=your_razorpay_secret
```

---

## 🐋 Push to Docker Hub

### **Login to Docker Hub**

```bash
docker login
# Enter username: himanshu0518
# Enter password: <your-token>
```

### **Tag Images (if needed)**

```bash
# Backend
docker tag eshop_backend himanshu0518/backend:latest

# Frontend
docker tag eshop_frontend himanshu0518/frontend:latest
```

### **Push Images**

```bash
# Push backend
docker push himanshu0518/backend:latest

# Push frontend
docker push himanshu0518/frontend:latest
```

### **Push with Version Tag**

```bash
# Tag with version
docker tag himanshu0518/backend:latest himanshu0518/backend:v1.0.0
docker tag himanshu0518/frontend:latest himanshu0518/frontend:v1.0.0

# Push versioned images
docker push himanshu0518/backend:v1.0.0
docker push himanshu0518/frontend:v1.0.0
```

---

## 🔍 Troubleshooting

### **Issue: Backend fails with DATABASE_URL error**

**Problem:** Prisma can't connect to database

**Solution:**
```bash
# Check if DATABASE_URL is set
docker-compose exec backend env | grep DATABASE_URL

# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs backend
```

---

### **Issue: Frontend can't connect to backend**

**Problem:** API calls failing

**Solution:**
1. Verify backend is running: `docker-compose ps`
2. Check nginx config proxies to `backend:8000`
3. Test backend health: `curl http://localhost:8000/health`

---

### **Issue: Prisma generate fails**

**Problem:** Schema mismatch or DB connection

**Solution:**
```bash
# Execute inside container
docker-compose exec backend sh

# Inside container
npx prisma generate
npx prisma migrate deploy
exit
```

---

### **Issue: Port already in use**

**Problem:** Port 80 or 8000 is occupied

**Solution:**
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :8000

# Kill process or change ports in docker-compose.yml
ports:
  - "3000:80"      # Frontend on port 3000
  - "8001:8000"    # Backend on port 8001
```

---

## 🏥 Health Checks

### **Backend Health Check**

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-03T..."
}
```

### **Frontend Health Check**

```bash
curl http://localhost:80
```

Should return HTML of the app.

---

## 📊 Container Management

### **View Running Containers**

```bash
docker ps
```

### **View All Containers**

```bash
docker ps -a
```

### **Remove Stopped Containers**

```bash
docker container prune
```

### **View Images**

```bash
docker images
```

### **Remove Unused Images**

```bash
docker image prune
```

### **Remove Everything (DANGER)**

```bash
docker system prune -a --volumes
```

---


---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow** (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push backend
        run: |
          cd server
          docker build -t himanshu0518/backend:latest .
          docker push himanshu0518/backend:latest
      
      - name: Build and push frontend
        run: |
          cd client
          docker build -t himanshu0518/frontend:latest .
          docker push himanshu0518/frontend:latest
```

---

## 📝 Quick Reference

### **Common Commands**

```bash
# Build all images
docker-compose build

# Pull latest images
docker-compose pull

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh

# View container stats
docker stats
```

---

## ✅ Deployment Checklist

- [ ] Environment variables set in `.env`
- [ ] Database accessible from containers
- [ ] Images built successfully
- [ ] Backend health check passing
- [ ] Frontend loads correctly
- [ ] API requests working
- [ ] Images pushed to Docker Hub
- [ ] Production environment configured
- [ ] SSL/TLS certificates configured (if production)
- [ ] Monitoring and logging set up

---

## 📞 Support

If you encounter issues:
1. Check container logs: `docker-compose logs [service]`
2. Verify environment variables
3. Test database connectivity
4. Check network connectivity between containers

---


