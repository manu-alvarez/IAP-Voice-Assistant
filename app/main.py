import os
import time
import asyncio
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.presentation.api.routes import router
from app.tools.telegram_tool import telegram_polling_loop

# ------------------------------------------------------------------------------
# BACKGROUND TASK: Limpieza de archivos temporales
# ------------------------------------------------------------------------------
async def cleanup_task():
    """Limpia archivos más antiguos de 10 minutos (600 segundos)"""
    folders = ["temp_audio", "temp_vision", "scripts"]
    MAX_AGE = 600 
    
    while True:
        try:
            now = time.time()
            for folder in folders:
                if not os.path.exists(folder):
                    continue
                for filename in os.listdir(folder):
                    filepath = os.path.join(folder, filename)
                    if os.path.isfile(filepath):
                        # Ignorar el '__init__.py' si por alguna razon existe
                        if filename == "__init__.py":
                            continue
                        file_age = now - os.path.getmtime(filepath)
                        if file_age > MAX_AGE:
                            os.remove(filepath)
                            print(f"[Cleanup] Borrado archivo recurrente: {filepath}")
        except Exception as e:
            print(f"[Cleanup] Error limpiando archivos: {e}")
            
        # Esperar 5 minutos antes del próximo ciclo de limpieza
        await asyncio.sleep(300)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background tasks on boot
    cleanup = asyncio.create_task(cleanup_task())
    tg_poller = asyncio.create_task(telegram_polling_loop())
    yield
    # Cancel background tasks on shutdown
    cleanup.cancel()
    tg_poller.cancel()

# ------------------------------------------------------------------------------
# APLICACIÓN PRINCIPAL
# ------------------------------------------------------------------------------
app = FastAPI(title="IAPuta OS - Modular Core", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://51.91.108.173:8443",
        "http://51.91.108.173:8080",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar carpetas estáticas para servir imágenes y audios temporales
app.mount("/temp_audio", StaticFiles(directory="temp_audio"), name="temp_audio")
app.mount("/temp_vision", StaticFiles(directory="temp_vision"), name="temp_vision")

# Incluir Rutas de IA
app.include_router(router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "IAPuta OS Core"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.FRONTEND_PORT, reload=True)
