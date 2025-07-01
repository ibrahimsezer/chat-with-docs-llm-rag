# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /client

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Ensure all executables in node_modules/.bin have execute permissions
RUN find ./node_modules/.bin -type f -exec chmod +x {} \;

ENV PATH /client/node_modules/.bin:$PATH

RUN npm run build

# Stage 2: Serve with a lightweight web server
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
