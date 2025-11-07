# Development Guide

This guide covers how to set up and run the application stack for development.

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   cp .env.example .env
   ```

2. **Start the development stack:**
   ```bash
   docker-compose up
   ```

3. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432

## Development Workflow

### Running Services

```bash
# Start all services in development mode
docker-compose up

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
```

### Database Management

```bash
# Run database migrations
docker-compose --profile migration up migration

# Seed initial data
docker-compose --profile seed up seed

# Connect to database
docker-compose exec db psql -U postgres -d appdb
```

### Development Commands

```bash
# Rebuild and start a specific service
docker-compose up --build frontend

# Run shell in a service
docker-compose exec backend sh
docker-compose exec frontend sh

# Stop all services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

## Service Details

### Frontend (Node.js)
- **Port**: 3000
- **Technology**: Express.js with static file serving
- **Hot reload**: Not configured (use `docker-compose up --build` for changes)

### Backend (Python/FastAPI)
- **Port**: 8000
- **Technology**: FastAPI with TensorFlow
- **Auto-reload**: Not configured in Docker (use `docker-compose up --build` for changes)

### Database (PostgreSQL)
- **Port**: 5432
- **Version**: 15
- **Data persistence**: Docker volume `postgres_data`

## Environment Variables

Copy `.env.example` to `.env` and modify as needed:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=appdb

# Application
DATABASE_URL=postgresql://postgres:password@db:5432/appdb
DEBUG=false
```

## Testing Endpoints

### Frontend
```bash
curl http://localhost:3000/health
```

### Backend
```bash
# Health check
curl http://localhost:8000/health

# Root endpoint
curl http://localhost:8000/

# TensorFlow prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"data": [1, 2, 3, 4, 5]}'

# TensorFlow info
curl http://localhost:8000/tensorflow/info
```

## Troubleshooting

### Port Conflicts
If ports are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change frontend to port 3001
```

### Database Connection Issues
1. Ensure the database service is healthy:
   ```bash
   docker-compose ps db
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Test connection:
   ```bash
   docker-compose exec db pg_isready -U postgres -d appdb
   ```

### Build Issues
1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild from scratch:
   ```bash
   docker-compose build --no-cache
   ```

## Development Tips

1. **Volume mounts**: For live development, consider adding volume mounts to `docker-compose.yml`:
   ```yaml
   volumes:
     - ./frontend:/app
     - ./backend:/app
   ```

2. **Debugging**: Use `docker-compose exec` to run commands inside containers:
   ```bash
   docker-compose exec backend python -c "import tensorflow as tf; print(tf.__version__)"
   ```

3. **Performance**: Monitor resource usage:
   ```bash
   docker stats
   ```

## Next Steps

- Set up CI/CD pipeline
- Add comprehensive testing
- Configure monitoring and logging
- Set up development environment with hot reload