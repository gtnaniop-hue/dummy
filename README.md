# Dockerized Application Stack

A full-stack application with frontend (Node.js), backend (Python with TensorFlow), and PostgreSQL database, all containerized with Docker.

## Quick Start

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

## Services

- **Frontend**: Node.js application with build process and static file server
- **Backend**: Python API with TensorFlow support
- **Database**: PostgreSQL with persistent storage

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development instructions.

## Production

See [PRODUCTION.md](./PRODUCTION.md) for production deployment guide.