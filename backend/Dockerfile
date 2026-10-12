# ==============================================================================
# GoDevOps Backend - Production-Grade Hardened Dockerfile
# ==============================================================================
# 1. Base Image: Minimal Alpine Linux base to reduce image size and attack surface
FROM node:20-alpine

# Set production environment flags
ENV NODE_ENV=production

# 2. Working Directory: Isolated application directory inside container
WORKDIR /app

# 3. Layer Caching Optimization:
# Copy dependency manifests FIRST so Docker can cache the installed node_modules.
# Unless package.json or package-lock.json changes, this layer is instantly reused!
COPY package*.json ./

# 4. Clean Production Install:
# 'npm ci' is deterministic (uses lockfile), --omit=dev removes devDependencies,
# and cleaning cache keeps the image footprint ultra-light.
RUN npm ci --omit=dev && npm cache clean --force

# 5. Copy Application Source:
COPY . .

# 6. DevSecOps (Principle of Least Privilege):
# By default, Docker containers run as root (UID 0).
# We change ownership of /app to the built-in unprivileged 'node' user (UID 1000)
# and switch user context before running the application.
RUN chown -R node:node /app
USER node

# 7. Network Port Documentation
EXPOSE 5000

# 8. Container Health Check:
# Uses Alpine's built-in BusyBox 'wget' to query the health endpoint.
# If the backend hangs or crashes, Docker marks the container as (unhealthy).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# 9. Execution Form:
# Exec form (JSON array) passes OS signals (SIGTERM/SIGINT) directly to Node.js
# enabling graceful connection draining on shutdown.
CMD ["node", "server.js"]
