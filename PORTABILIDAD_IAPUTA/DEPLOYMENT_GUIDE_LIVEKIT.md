# 🎙️ LiveKit (Nikolina): Deployment Guide (Clean Architecture)

Esta guía te permite desplegar el ecosistema de voz interactiva de Nikolina en cualquier servidor VPS (Ubuntu/Debian) usando la nueva Clean Architecture (Microservicios desacoplados: Server + Agent).

## 📋 Requisitos Previos

- Servidor VPS (Mínimo 2GB RAM sugerido para Gemini Realtime).
- Node.js y npm (para el Dashboard).
- Python 3.12+ 
- Un servidor LiveKit Cloud / Open Source desplegado (`wss://tubucket.livekit.cloud`).

## 🛠️ Archivos de Entorno (.env)

Debes proporcionar un archivo `.env` tanto para el **Server** como para el **Agente**. Utiliza la plantilla `.env.example`.

### Variables Críticas:
- `LIVEKIT_URL`: URL de tu servidor LiveKit.
- `LIVEKIT_API_KEY`: Tu llave API pública de LiveKit.
- `LIVEKIT_API_SECRET`: Tu secreto de administración de LiveKit.
- `GOOGLE_API_KEY`: Tu llave de Google AI Studio (requerida para Gemini Flash Realtime).

## 🚀 Despliegue en VPS (Producción Automática)

El proyecto viene con un script de despliegue cero-caídas que gestiona las dependencias, reconstruye los entornos virtuales Python y registra los demonios Systemd.

1. Sube la carpeta `LIVEKIT_CLEAN` a tu VPS (ej: `/home/ubuntu/LIVEKIT`).
2. Dale permisos de ejecución al script principal:
   ```bash
   sudo chmod +x /home/ubuntu/LIVEKIT/scripts/deploy_clean.sh
   ```
3. Ejecútalo. El script hará un backup automático de tu vieja base de datos, construirá los entornos virtuales, e iniciará el Servidor FastAPI y el Agente de forma paralela y aislada.
   ```bash
   bash /home/ubuntu/LIVEKIT/scripts/deploy_clean.sh
   ```

## 📊 Arrancar los Dashboards

El **Admin Dashboard** (Gestión de Mesas y Reservas) y el **Dev Dashboard** (Pipeline) son aplicaciones de React integradas.
   
1. Navega a `dashboards/admin-dashboard`.
2. Renombra `.env.example` a `.env` y pega tus llaves de LiveKit.
3. Compila e inicia:
   ```bash
   npm install
   npm run build
   npm run preview
   ```
El panel estará expuesto por defecto en el puerto `4173` (o `3000` dependiendo del hosteo).

## 📦 Notas de la Arquitectura Clean
1. **Server (`server/main.py`)**: Gestiona la base de datos `restaurant.db` y provee la API REST para administrar las mesas y escupir los tokens de conexión a LiveKit (`/getToken`).
2. **Agente (`agent/src/agent.py`)**: Se conecta autónomamente a LiveKit usando tus llaves, escucha en las salas disponibles y despacha la lógica de Nikolina (STT/TTS/LLM).
3. **Database (`server/data/restaurant.db`)**: Totalmente gestionada por `database.py`. No la borres, contiene tus datos de reservas.
