import uuid
import os
import aiofiles
import logging
from fastapi import APIRouter, File, UploadFile, Header, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from app.core.config import settings
from app.application.use_cases.chat_use_case import ChatUseCase
from app.infrastructure.llm.groq_adapter import GroqAdapter
from app.infrastructure.audio.tts_stt_adapter import GroqEdgeAudioAdapter
from app.services.memory_service import clear_history
from app.domain.entities import AIResponse
from app.tools.toolbox import analyze_vision_image

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency injection (Factory pattern)
llm_port = GroqAdapter()
audio_port = GroqEdgeAudioAdapter()
chat_usecase = ChatUseCase(llm_adapter=llm_port, audio_adapter=audio_port)


def _verify_api_key(api_key: Optional[str] = None):
    """Verify API key if one is configured in settings."""
    expected = settings.IAPUTA_API_KEY
    if expected and api_key != expected:
        raise HTTPException(status_code=401, detail="API key inválida o ausente.")


class TextCommandRequest(BaseModel):
    text: str


class VisionAnalyzeRequest(BaseModel):
    image: str  # base64 encoded image
    source: str = "screenshot"  # "screenshot" or "webcam"
    prompt: str = None  # optional custom prompt


@router.post("/api/voice-command", response_model=AIResponse)
async def voice_command_endpoint(
    audio_file: UploadFile = File(...),
    x_api_key: Optional[str] = Header(None)
):
    _verify_api_key(x_api_key)
    try:
        content = await audio_file.read()
        if len(content) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "El archivo de audio está vacío."}
            )

        content_type = audio_file.content_type
        ext = "mp4" if content_type and "mp4" in content_type else "webm"

        temp_in = f"temp_audio/in_{uuid.uuid4().hex[:6]}.{ext}"
        async with aiofiles.open(temp_in, "wb") as f:
            await f.write(content)

        res = await chat_usecase.execute_voice(temp_in)
        return res.model_dump()

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in voice-command endpoint")
        error_msg = str(e)
        is_rate_limit = "429" in error_msg or "rate_limit" in error_msg.lower()

        return JSONResponse(
            status_code=429 if is_rate_limit else 500,
            content={
                "transcript": "Audio procesado con errores.",
                "error": f"Error: {error_msg}",
                "audio_url": None,
                "vision_url": None,
                "emotion": "error"
            }
        )


@router.post("/api/text-command", response_model=AIResponse)
async def text_command_endpoint(
    request: TextCommandRequest,
    x_api_key: Optional[str] = Header(None)
):
    _verify_api_key(x_api_key)
    try:
        res = await chat_usecase.execute_text(request.text)
        return res.model_dump()

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in text-command endpoint")
        error_msg = str(e)
        is_rate_limit = "429" in error_msg or "rate_limit" in error_msg.lower()

        return JSONResponse(
            status_code=429 if is_rate_limit else 500,
            content={
                "transcript": "Comando de texto interceptado.",
                "error": f"Error: {error_msg}",
                "audio_url": None,
                "vision_url": None,
                "emotion": "error"
            }
        )


@router.post("/api/vision-analyze")
async def vision_analyze_endpoint(
    request: VisionAnalyzeRequest,
    x_api_key: Optional[str] = Header(None)
):
    """
    Receives a base64-encoded image from the frontend (screenshot or webcam)
    and returns AI analysis using Groq Vision.
    """
    _verify_api_key(x_api_key)
    try:
        analysis, vision_url = await analyze_vision_image(
            request.image, request.prompt, request.source
        )

        # Generate TTS audio for the analysis
        audio_url = None
        try:
            audio_url = await audio_port.generate_speech(analysis)
        except Exception as tts_err:
            logger.warning(f"TTS failed for vision analysis: {tts_err}")

        return {
            "response": analysis,
            "vision_url": vision_url,
            "audio_url": audio_url,
            "emotion": "thinking",
            "source": request.source
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in vision-analyze endpoint")
        return JSONResponse(
            status_code=500,
            content={
                "response": f"Error al analizar la imagen: {e}",
                "vision_url": None,
                "audio_url": None,
                "emotion": "error"
            }
        )


@router.post("/api/clear-memory")
async def clear_memory_endpoint(x_api_key: Optional[str] = Header(None)):
    _verify_api_key(x_api_key)
    clear_history()
    return {"status": "success", "message": "Memoria purgada limpiamente."}


@router.get("/api/status")
async def status_endpoint():
    """Public status endpoint — no auth required."""
    return {
        "status": "online",
        "service": "IAPuta OS Core",
        "version": "2.0.0",
        "auth_required": bool(settings.IAPUTA_API_KEY)
    }
