#!/bin/sh
set -e

# Wait for DB to be ready might be handled by docker-compose healthcheck, 
# but this script ensures migrations run before start.
echo "🚀 Running prisma migrations..."
npx prisma migrate deploy

echo "🌱 Starting server..."
exec pnpm start
