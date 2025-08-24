# TaskFlow Application Deployment Guide

## Overview
This guide covers deploying the TaskFlow application using Docker and Caddy as a reverse proxy, with automated deployment via GitHub Actions.

## Architecture
- **Frontend**: React application served by Node.js HTTP server
- **Backend**: Node.js/Express API server
- **Database**: MongoDB with authentication
- **Cache**: Redis for session management
- **Reverse Proxy**: Caddy v2 with automatic HTTPS
- **Containerization**: Docker with docker-compose

## Prerequisites
- Docker and Docker Compose installed on server
- Git access to the repository
- Server with ports 80, 443, 27017, 6379, 3000, 5000 available
- Domain name (optional, for production)

## Server Setup

### 1. Install Docker and Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Create Project Directory
```bash
sudo mkdir -p /opt/taskflow
sudo chown $USER:$USER /opt/taskflow
cd /opt/taskflow
```

### 3. Clone Repository
```bash
git clone https://github.com/yourusername/taskflow-test-completed.git .
```

## Configuration

### 1. Environment Variables
Create `.env` file in the project root:
```bash
# Database
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
MONGO_INITDB_DATABASE=taskflow

# Backend
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

### 2. Caddy Configuration
The Caddyfile is pre-configured for localhost. For production, update `docker/caddy/Caddyfile`:
```caddy
yourdomain.com {
    tls your-email@example.com
    
    # ... rest of configuration
}
```

### 3. SSL Certificates
For production, Caddy will automatically obtain Let's Encrypt certificates. For localhost, it uses self-signed certificates.

## Deployment

### 1. Manual Deployment
```bash
# Build and start services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Health checks
curl http://localhost/health
curl http://localhost/api/health
```

### 2. Automated Deployment (GitHub Actions)
The GitHub Actions workflow automatically deploys on push to main branch.

#### Required Secrets
Set these in your GitHub repository secrets:
- `SERVER_HOST`: Your server's IP address or domain
- `SERVER_USERNAME`: SSH username
- `SERVER_SSH_KEY`: Private SSH key for server access
- `SERVER_PORT`: SSH port (usually 22)

#### Workflow Features
- **Testing**: Runs tests before deployment
- **Building**: Builds Docker images and pushes to registry
- **Deployment**: SSH into server and updates services
- **Health Checks**: Verifies deployment success
- **Rollback**: Manual rollback capability

## Service Management

### 1. Start Services
```bash
docker-compose up -d
```

### 2. Stop Services
```bash
docker-compose down
```

### 3. Restart Services
```bash
docker-compose restart
```

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f caddy
```

### 5. Update Services
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Monitoring and Health Checks

### 1. Service Health
```bash
# Check all services
docker-compose ps

# Health check endpoints
curl http://localhost/health          # Caddy health
curl http://localhost/api/health      # Backend health
curl http://localhost:3000/health     # Frontend health
```

### 2. Resource Usage
```bash
# Docker stats
docker stats

# Container resource usage
docker-compose top
```

### 3. Log Monitoring
```bash
# Caddy access logs
docker-compose exec caddy tail -f /var/log/caddy/access.log

# Caddy error logs
docker-compose exec caddy tail -f /var/log/caddy/error.log

# Backend logs
docker-compose logs -f backend
```

## Troubleshooting

### 1. Common Issues

#### Port Conflicts
```bash
# Check what's using a port
sudo netstat -tulpn | grep :80

# Kill process using port
sudo kill -9 <PID>
```

#### Container Won't Start
```bash
# Check container logs
docker-compose logs <service_name>

# Check container status
docker-compose ps -a
```

#### Database Connection Issues
```bash
# Check MongoDB status
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check Redis status
docker-compose exec redis redis-cli ping
```

### 2. Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up -d --build
```

## Security Considerations

### 1. Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 2. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords
- Rotate JWT secrets regularly
- Limit database access to application only

### 3. SSL/TLS
- Caddy automatically handles Let's Encrypt certificates
- Certificates auto-renew
- HTTP/2 enabled by default
- Security headers automatically applied

## Backup and Recovery

### 1. Database Backup
```bash
# Create backup
docker-compose exec mongodb mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore backup
docker-compose exec mongodb mongorestore /backup/backup_folder
```

### 2. Application Backup
```bash
# Backup configuration files
tar -czf taskflow-config-$(date +%Y%m%d).tar.gz \
    docker-compose.yml \
    docker/caddy/ \
    .env \
    server/config/
```

## Performance Optimization

### 1. Docker Optimizations
```bash
# Use multi-stage builds (already implemented)
# Enable build cache
# Use .dockerignore files
```

### 2. Caddy Optimizations
- HTTP/2 enabled by default
- Gzip compression enabled
- Static asset caching
- Rate limiting for API endpoints

### 3. Database Optimizations
- MongoDB indexes on frequently queried fields
- Redis for session caching
- Connection pooling

## Scaling Considerations

### 1. Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Load balancing with Caddy
# Add more MongoDB replicas
```

### 2. Vertical Scaling
- Increase container memory/CPU limits
- Optimize application code
- Database query optimization

## Maintenance

### 1. Regular Updates
```bash
# Update Docker images
docker-compose pull

# Update application code
git pull origin main

# Rebuild if necessary
docker-compose up -d --build
```

### 2. Log Rotation
- Caddy logs are automatically managed
- Consider log aggregation for production
- Monitor disk space usage

### 3. Security Updates
- Keep Docker images updated
- Monitor for security vulnerabilities
- Regular security audits

## Support and Resources

- **Docker Documentation**: https://docs.docker.com/
- **Caddy Documentation**: https://caddyserver.com/docs/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **GitHub Actions**: https://docs.github.com/en/actions

## Emergency Contacts

- **System Administrator**: [Contact Info]
- **Database Administrator**: [Contact Info]
- **Application Developer**: [Contact Info]

---

**Note**: This deployment guide assumes a Linux server environment. Adjust commands for other operating systems as needed.
