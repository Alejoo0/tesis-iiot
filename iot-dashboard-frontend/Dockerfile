FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- AQUÍ ESTÁ LA MAGIA ---
# 1. Definimos que aceptamos este argumento
ARG VITE_API_BASE_URL
# 2. Lo convertimos en variable de entorno para que Vite lo lea durante el build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# --------------------------
COPY . .
RUN npm run build

# --- ETAPA 2: Servidor Web (Nginx) ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]