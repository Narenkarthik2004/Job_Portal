# Build phase
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
