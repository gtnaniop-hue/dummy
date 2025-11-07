.PHONY: help build up down logs clean test migrate seed prod-build prod-up prod-down prod-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build all Docker images"
	@echo "  up           - Start development environment"
	@echo "  down         - Stop development environment"
	@echo "  logs         - Show logs for all services"
	@echo "  clean        - Remove containers, images, and volumes"
	@echo "  test         - Run tests"
	@echo "  migrate      - Run database migrations"
	@echo "  seed         - Seed database with initial data"
	@echo "  prod-build   - Build production images"
	@echo "  prod-up      - Start production environment"
	@echo "  prod-down    - Stop production environment"
	@echo "  prod-logs    - Show production logs"

# Development commands
build:
	docker-compose build

up:
	docker-compose up

up-d:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-frontend:
	docker-compose logs -f frontend

logs-backend:
	docker-compose logs -f backend

logs-db:
	docker-compose logs -f db

clean:
	docker-compose down -v --rmi all

# Database commands
migrate:
	docker-compose --profile migration up migration

seed:
	docker-compose --profile seed up seed

# Testing
test:
	docker-compose exec backend python -m pytest || true
	docker-compose exec frontend npm test || true

# Production commands
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

# Utility commands
shell-frontend:
	docker-compose exec frontend sh

shell-backend:
	docker-compose exec backend sh

shell-db:
	docker-compose exec db psql -U postgres -d appdb

# Quick development setup
dev-setup: build
	@echo "Setting up development environment..."
	cp .env.example .env
	@echo "Environment file created. Please edit .env with your settings."
	@echo "Run 'make up' to start the development environment."

# Production deployment
deploy: prod-build
	@echo "Deploying to production..."
	docker-compose -f docker-compose.prod.yml --profile migration up migration
	docker-compose -f docker-compose.prod.yml --profile seed up seed
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Deployment complete!"