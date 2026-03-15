# 🎙️ Ecosistema LiveKit Desatendido (Motor + Cerebro)

Este paquete contiene todo lo necesario para ejecutar tu propio ecosistema de LiveKit 100% aislado en tu ordenador local, sin depender de tu VPS.

## Requisitos previos:
- Tener **Docker** y **Docker-Compose** instalados (Docker Desktop en Mac).

## Instalación en 1 click:
Abre una terminal en esta misma carpeta y ejecuta:
```bash
docker-compose up -d --build
```

Esto levantará 3 servicios:
1. **El Motor de LiveKit** (en el puerto 7880)
2. **La base de datos Redis** interna (puerto 6380)
3. **Tu Agente de IA "Nikolina"** que se conectará a ese motor local automáticamente.

### Modelos de Inteligencia Artificial
El agente carga automáticamente tus modelos indicados en el código (llama / Gemini / OpenAI) gracias a las API keys incluidas en el archivo `agent/.env`. Si usas modelos de pago o API Keys, verifica ese archivo.

Para detener todo, simplemente ejecuta:
```bash
docker-compose down
```
