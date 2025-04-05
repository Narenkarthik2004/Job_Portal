# Stage 1: Build the frontend app
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Use nginx to serve it
FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
