# IAPuta OS - Modular Deployment Guide

Este proyecto ha sido refactorizado aplicando **Clean Architecture (Ports & Adapters)**, integrado con React/Vite/MUI M3 en el frontend, y dockerizado para su despliegue inmutable en **VPS Producción**.

## Requisitos Previos (VPS)
- Docker y Docker Compose instalados.
- Un servidor VPS con Linux (Ubuntu Server recomendado).
- Git.

## Pasos para Despliegue Automatizado
1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPO> iaputa-os
   cd iaputa-os
   ```

2. **Configurar Entorno**:
   El proyecto es 100% seguro (secrets expurgados). Necesitas crear el `.env`:
   ```bash
   cp .env.example .env
   # Edita el archivo con nano o vim e inserta tus Tokens reales de Groq, Tavily, etc.
   nano .env
   ```

3. **Caché y Permisos de Github**:
   Comprueba que los entornos Python no están corrompiendo la carga local, usando los hooks configurados de `.gitignore` los cuales excluyen todas aquellas claves y contraseñas tuyas.

4. **Levantar el Servicio**:
   Gracias al estándar de **Twelve-Factor App**, el despliegue es en un comando:
   ```bash
   docker-compose up -d --build
   ```

5. **Auditoría UI y Logs**:
   - Abre en el navegador la IP del servidor en el puerto 8000.
   - Lee los logs en tiempo real para observar el núcleo de IA:
   ```bash
   docker-compose logs -f iaputa-backend
   ```

## Pipeline CI/CD Actual
Si usas Github, los tests de unidad (`pytest` para domain/use cases) y el lint correrán automáticamente cada vez que empujes a main, previniendo fallos en producción.
