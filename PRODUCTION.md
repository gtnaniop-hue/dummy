# Production Deployment Guide

This guide covers how to deploy the application stack to production.

## Prerequisites

- Docker and Docker Compose installed
- Production server with adequate resources
- SSL certificates (for HTTPS)
- Environment configuration

## Quick Start

1. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Deploy production stack:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Production Configuration

### Environment Variables

Create a secure `.env` file with production values:

```bash
# Database - Use strong passwords
POSTGRES_USER=app_user
POSTGRES_PASSWORD=super_secure_password_change_me
POSTGRES_DB=production_db

# Application
DATABASE_URL=postgresql://app_user:super_secure_password_change_me@db:5432/production_db
NODE_ENV=production
DEBUG=false
```

### Security Considerations

1. **Change default passwords**
2. **Use HTTPS with SSL certificates**
3. **Configure firewall rules**
4. **Set up monitoring and logging**
5. **Regular security updates**

## Deployment Steps

### 1. Prepare Server

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

### 2. Setup Application

```bash
# Clone repository
git clone <repository-url> /opt/app
cd /opt/app

# Configure environment
cp .env.example .env
# Edit .env with production values

# Setup SSL certificates (optional)
mkdir -p nginx/ssl
# Copy your SSL certificates to nginx/ssl/
```

### 3. Deploy Services

```bash
# Run database migrations
docker-compose -f docker-compose.prod.yml --profile migration up migration

# Seed initial data
docker-compose -f docker-compose.prod.yml --profile seed up seed

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check health endpoints
curl http://localhost/nginx-health
curl http://localhost/health
curl http://localhost/api/health
```

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d yourdomain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

### Update Nginx Configuration

Uncomment and configure the HTTPS section in `nginx/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of SSL configuration
}
```

## Monitoring and Logging

### Health Checks

All services include built-in health checks:

```bash
# View health status
docker-compose -f docker-compose.prod.yml ps

# View health check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Log Management

```bash
# View logs for all services
docker-compose -f docker-compose.prod.yml logs -f

# View logs for specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Rotate logs (add to docker-compose.prod.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Resource Monitoring

```bash
# Monitor container resource usage
docker stats

# Set up alerts for:
# - High CPU/memory usage
# - Disk space
# - Service health failures
```

## Backup and Recovery

### Database Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Schedule with cron
echo "0 2 * * * /opt/app/backup.sh" | crontab -
```

### Application Backups

```bash
# Backup application data
tar -czf app_backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=postgres_data \
  .
```

## Scaling

### Horizontal Scaling

```yaml
# In docker-compose.prod.yml, add replicas
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing

The nginx configuration is set up for load balancing multiple backend instances.

## Performance Optimization

### Database Optimization

```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_column ON table_name(column_name);
```

### Application Optimization

1. **Enable caching** in backend
2. **Use CDN** for static assets
3. **Optimize images** and assets
4. **Enable gzip compression** in nginx

## Maintenance

### Updates

```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Update base images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Rolling Updates

```bash
# Update with zero downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
```

## Troubleshooting

### Common Issues

1. **Out of memory**: Increase container memory limits
2. **Database connection errors**: Check network and credentials
3. **SSL certificate issues**: Verify certificate paths and permissions
4. **High CPU usage**: Scale services or optimize code

### Debug Commands

```bash
# Shell access to containers
docker-compose -f docker-compose.prod.yml exec backend sh
docker-compose -f docker-compose.prod.yml exec frontend sh

# Inspect container details
docker inspect <container_name>

# View resource usage
docker stats <container_name>
```

## Security Best Practices

1. **Regularly update** base images and dependencies
2. **Use secrets management** for sensitive data
3. **Implement rate limiting** (already configured in nginx)
4. **Monitor access logs** for suspicious activity
5. **Use intrusion detection** systems
6. **Regular security audits**

## Emergency Procedures

### Service Recovery

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Recover from backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB < backup.sql
```

### Disaster Recovery

1. **Restore from latest backup**
2. **Verify data integrity**
3. **Test all endpoints**
4. **Monitor system performance**
5. **Communicate with stakeholders**