#!/bin/bash

# Run database migrations
set -e

echo "Running database migrations..."

# Wait for database to be ready
./scripts/wait-for-db.sh db alembic upgrade head

echo "Migrations completed successfully!"