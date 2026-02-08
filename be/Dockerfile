FROM node:20-slim

# Install OpenSSL for Prisma and clean up
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files separately for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (only production if you want, but prisma needs devDeps for build)
RUN pnpm install

# Copy the rest of the code
COPY . .

# Generate Prisma Client and build TypeScript
RUN pnpm build

# Fix permissions for the start script
RUN chmod +x docker-start.sh

EXPOSE 3001

# Use the entrypoint script to run migrations
CMD ["./docker-start.sh"]
