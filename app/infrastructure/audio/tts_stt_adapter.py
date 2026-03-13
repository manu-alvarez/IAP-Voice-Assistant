import uuid
import re
import os
import edge_tts
from app.core.groq_client import groq_client
from app.application.interfaces.ai_port import AudioPort


def _clean_for_tts(text: str) -> str:
    """Elimina bloques de código y ruido visual antes de convertir a voz."""
    # Eliminar bloques de código markdown (```...```)
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Eliminar bloques XML completos como <os_control>...</os_control> o <function>...</function>
    text = re.sub(r'<[a-zA-Z0-9_]+[^>]*>[\s\S]*?</[a-zA-Z0-9_]+>', '', text)
    # Casos donde la etiqueta de cierre falle o queden fragmentos XML raros (<f. raw...>)
    text = re.sub(r'<[^>]+>', '', text)
    # Eliminar bloques de expresiones JSON puras si se escapan (ej: {"act": "open_app"...})
    text = re.sub(r'\{[^{}]*\}', '', text)
    # Eliminar tags como [NEUTRAL] o [EMOTION: happy]
    text = re.sub(r'\[[A-Z_]+[^\]]*\]', '', text)
    # Eliminar código inline (`...`)
    text = re.sub(r'`[^`]+`', '', text)
    # Eliminar URLs
    text = re.sub(r'https?://\S+', '', text)
    # Eliminar líneas que sean solo guiones o símbolos decorativos
    text = re.sub(r'^[\-=_*]{3,}$', '', text, flags=re.MULTILINE)
    # Colapsar múltiples saltos de línea
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Limitar a 600 caracteres para respuestas muy largas
    text = text.strip()
    if len(text) > 600:
        text = text[:597] + "..."
    return text


class GroqEdgeAudioAdapter(AudioPort):
    def __init__(self):
        self.groq_client = groq_client
        
    async def transcribe(self, audio_path: str) -> str:
        """STT via Whisper asíncrono"""
        with open(audio_path, "rb") as f:
            transcription = await self.groq_client.audio.transcriptions.create(
                file=(os.path.basename(audio_path), f.read()), 
                model="whisper-large-v3", 
                response_format="text"
            )
        return transcription

    async def generate_speech(self, text: str) -> str:
        """TTS asíncrono via Edge-TTS — filtra código y ruido antes de hablar."""
        clean_text = _clean_for_tts(text)
        if not clean_text:
            clean_text = "Listo."
        temp_out = f"temp_audio/out_{uuid.uuid4().hex[:6]}.mp3"
        communicate = edge_tts.Communicate(clean_text, "es-ES-AlvaroNeural", rate="+15%")
        await communicate.save(temp_out)
        return f"/{temp_out}"
