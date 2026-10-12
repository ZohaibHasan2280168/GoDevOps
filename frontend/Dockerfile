# ==============================================================================
# GoDevOps Frontend - Multi-Stage Production Dockerfile
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Environment (Compiles React + Vite into static bundles)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Layer Caching: Copy manifests first to cache dependencies layer
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Pass API URL at build time so Vite embeds it into the compiled bundle
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle into /app/dist
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime (Ultra-lightweight Nginx server)
# Node.js and ~500MB of build tools are completely discarded!
# ------------------------------------------------------------------------------
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (handles SPA routing + /api reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is responding to web traffic
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

# Start Nginx in foreground (daemon off) so the container stays running
CMD ["nginx", "-g", "daemon off;"]
