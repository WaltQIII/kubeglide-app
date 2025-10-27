# --- backend/Dockerfile ---
FROM node:20-bookworm-slim

# Minimal OS deps
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies with lockfile for reproducibility
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy app and build Strapi admin
COPY . .
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
