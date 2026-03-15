# 🚀 IAPuta OS: Deployment Guide (Portabilidad Universal)

Esta guía te permite desplegar el frontal principal de IAPuta OS (la Interfaz Premium de usuario con visión, orbe y chat) en cualquier servidor Linux (Ubuntu/Debian) o entorno de pruebas local (Mac/Windows con Docker).

## 📋 Requisitos Previos

- Servidor VPS o Máquina Local con Docker y Docker Compose instalados.
- Un dominio apuntando a tu IP (si vas a usar HTTPS/Nginx).
- Node.js (v18 o superior) si quieres desarrollar localmente.

## 🛠️ Configuración Inicial (Environment)

1. Renombra el archivo `.env.example` a `.env` en la raíz de `IAPuta OS`.
2. Cumplimenta las API keys necesarias:
   - `OPENAI_API_KEY`: Requerida para Whisper (Opcional si usas los Endpoints Llama 3 locales).
   - `LLAMA_4_SCOUT_KEY`: Requerida para la visión por computador de la cámara web.
   - `TAVILY_API_KEY`: Requerida para el plugin de "Busqueda Web Global".

## 📦 Despliegue Rápido (Producción VPS)

IAPuta OS utiliza un Nginx contenedorizado preparado para servir estáticos con caché ultra-rápida.

### Pasos:
1. Clona el repositorio IAPuta OS en tu servidor (Ej: `/home/ubuntu/IAPUTA_OS`).
2. Entra en la carpeta raíz.
3. Compila los estáticos de React (si no lo has hecho en Mapeo Local):
   ```bash
   npm install
   npm run build
   ```
4. Levanta el contenedor de producción:
   ```bash
   docker-compose up -d --build
   ```

Tu servidor estará levantado en el puerto `8080`.

## 🔒 Despliegue con Nginx Externo (Recomendado para Dominio)

Si ya tienes un Nginx físico en tu servidor (como en el servidor M.A.S.B):
1. Asegúrate de que los estáticos están compilados en la carpeta `dist/`.
2. Mueve todo el contenido de `dist/` a tu raíz web (`/var/www/html/iaputa`).
3. Configura Nginx para que redirija las peticiones a FastAPI sobre HTTPS (CORS), de lo contrario la cámara web o las peticiones de red fallada (Error 401). (Consulta el archivo de referencia de Nginx).

## 💻 Desarrollo Local
Si quieres usarlo en casa, solo para ti:
```bash
npm install
npm run dev
```

El orbe estará disponible en `http://localhost:5173`.
