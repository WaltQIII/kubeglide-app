# Stage 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json ONLY
COPY package.json ./

# Run npm install
RUN npm install

# Now, copy the rest of the app code
COPY . .

# Run the build
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]