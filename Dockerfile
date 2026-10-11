# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Production Stage with NGINX
FROM nginx:alpine

# Copy built static bundle to NGINX HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
