# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Configuration "docker" : l'API est appelée via /api (proxy nginx -> backend)
RUN npm run build -- --configuration docker

# Stage 2: Serveur Nginx de production
FROM nginx:alpine
COPY --from=build /app/dist/unistage-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
