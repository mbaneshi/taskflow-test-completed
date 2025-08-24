# 🚀 TaskFlow Quick Start Guide

## ✅ **Fixed Connection Issues**

All backend-frontend connection problems have been resolved:

- **Backend Port**: Standardized to port 5000
- **Frontend Port**: Running on port 3000  
- **API URLs**: Correctly configured for local development
- **Docker Ports**: Fixed container port mappings
- **Caddy Proxy**: Correctly routes to container ports
- **Database**: Proper initialization and connection setup

## 🚀 **Quick Start Commands**

### **1. Start Everything with Docker**
```bash
# Start all services
npm run docker:up

# Check logs
npm run docker:logs

# Stop services
npm run docker:down
```

### **2. Development Mode (Local)**
```bash
# Install dependencies
npm install

# Start backend only
npm run server

# Start frontend only  
npm run client

# Start both (recommended)
npm run dev
```

### **3. Test Connections**
```bash
# Test all connections
npm run test:connection
```

## 🌐 **Service URLs**

| Service | URL | Port | Status |
|---------|-----|------|--------|
| **Frontend** | http://localhost:3000 | 3000 | ✅ Fixed |
| **Backend API** | http://localhost:5000 | 5000 | ✅ Fixed |
| **Database** | mongodb://localhost:27017 | 27017 | ✅ Fixed |
| **Caddy Proxy** | http://localhost:80 | 80 | ✅ Fixed |

## 🔧 **Configuration Files Updated**

- ✅ `server/src/index.js` - Backend port fixed
- ✅ `src/api.js` - API URL corrected  
- ✅ `vite.config.js` - Proxy configuration added
- ✅ `docker-compose.yml` - Port mappings fixed
- ✅ `docker/caddy/Caddyfile` - Container ports corrected
- ✅ `Dockerfile.frontend` - Health check fixed
- ✅ `docker/mongo/init/init-mongo.js` - Database setup added

## 🗄️ **Database Setup**

- **Initial Admin User**: `admin@taskflow.com` / `admin123`
- **Collections**: users, tasks, userlogs
- **Indexes**: Optimized for performance
- **Validation**: Schema validation enabled

## 🧪 **Testing**

Run comprehensive tests:
```bash
npm run test:all
```

Test specific areas:
```bash
npm run test:backend    # Backend tests
npm run test:frontend   # Frontend tests
npm run test:e2e        # End-to-end tests
```

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :5000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### **Database Connection Issues**
```bash
# Check MongoDB status
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb
```

### **Frontend Not Loading**
```bash
# Check frontend container
docker-compose ps frontend

# View frontend logs
docker-compose logs frontend
```

## 📝 **Environment Variables**

Copy `env.example` to `.env` and configure:
```bash
cp env.example .env
# Edit .env with your values
```

## 🎯 **Next Steps**

1. **Start services**: `npm run docker:up`
2. **Test connections**: `npm run test:connection`
3. **Access frontend**: http://localhost:3000
4. **Login**: admin@taskflow.com / admin123
5. **Create tasks and test functionality**

---

**🎉 All connection issues resolved! Your TaskFlow app should now work perfectly.**
