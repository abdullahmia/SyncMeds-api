# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .


# RUN npm run prisma:generate
# RUN npm run build

# CMD ["npm", "run", "start:prod"]

# Stage 1: Build
FROM node:20-alpine AS builder

# Install system dependencies (required for some npm packages)
RUN apk add --no-cache python3 make g++ git openssh-client

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies with clean cache
RUN npm install --legacy-peer-deps --prefer-offline \
    && npm cache clean --force

# Copy all files
COPY . .

# Generate Prisma client and build
RUN npm run prisma:generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["npm", "run", "start:prod"]