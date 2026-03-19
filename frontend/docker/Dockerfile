# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ============================================
# Stage 2: Nginx
# ============================================
FROM nginx:alpine

# Install envsubst
RUN apk --no-cache add gettext

# Copy nginx template
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
