"""
MSB LiveKit Voice Assistant — Restaurant Reservation Agent

Multimodal voice agent powered by Gemini 2.5 Flash (Native Audio) OR
Modular Pipeline (Ollama + Faster-Whisper + Kokoro) specialized in restaurant table reservation management.

Architecture:
  - RealtimeModel: Single pipeline handling STT + LLM + TTS via Gemini Live API
  - VoicePipelineAgent: Modular pipeline (Ollama LLM + STT Plugin + TTS Plugin)
  - VoiceAgent:    Restaurant personality with reservation management tools
  - AgentSession:  Manages the real-time audio session lifecycle
  - RestaurantDB:  SQLite database for tables, reservations and call history

Usage:
  python agent.py dev      # Development mode with hot-reload
  python agent.py start    # Production mode
"""

import os
import asyncio
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

from dotenv import load_dotenv

from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import google
from livekit.plugins.google.realtime import RealtimeModel

# Import shared core from the Server decouple
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../server/src')))
from core.database import db

import providers

# Load environment variables
load_dotenv()

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = os.path.join(os.path.dirname(__file__), "../agent.log")

formatter = logging.Formatter(LOG_FORMAT)
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=2)
file_handler.setFormatter(formatter)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logger = logging.getLogger("msb-assistant")
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# ---------------------------------------------------------------------------
# Restaurant Agent Tools
# ---------------------------------------------------------------------------

@llm.function_tool(
    description=(
        "Check table availability at the restaurant for a specific date, time, and party size. "
        "Returns a list of available tables. Always use this BEFORE creating a reservation."
    )
)
async def check_availability(
    date: str,
    time: str,
    num_guests: int,
) -> str:
    """Check table availability."""
    logger.info("Tool: check_availability(date=%s, time=%s, guests=%d)", date, time, num_guests)
    try:
        available_tables = db.check_availability(date, time, num_guests)
        if not available_tables:
            return f"Lo siento, no hay mesas disponibles para {num_guests} personas el {date} a las {time}."
        
        table = available_tables[0]
        return (
            f"Sí, tenemos disponibilidad. Podemos ofrecerle la mesa {table['table_number']} "
            f"en la zona de {table['location']}. "
            "¿Desea que le reserve una?"
        )
    except Exception as exc:
        logger.error("check_availability failed: %s", exc)
        return "Ha ocurrido un error al consultar la disponibilidad. Inténtelo de nuevo."


@llm.function_tool(
    description=(
        "Create a table reservation at the restaurant. "
        "IMPORTANT: Always call check_availability first. "
        "Requires the customer name, date, time, and number of guests."
    )
)
async def create_reservation(
    customer_name: str, 
    date: str, 
    time: str, 
    num_guests: int,
    customer_phone: str = "", 
    notes: str = ""
) -> str:
    """Create a new reservation."""
    logger.info(
        "Tool: create_reservation(name=%s, date=%s, time=%s, guests=%d)",
        customer_name, date, time, num_guests,
    )
    try:
        result = db.create_reservation(
            customer_name=customer_name,
            date=date,
            time=time,
            num_guests=num_guests,
            customer_phone=customer_phone,
            notes=notes,
            source="phone",
        )
        return (
            f"Reserva confirmada. Número de reserva: {result['reservation_id']}. "
            f"A nombre de {result['customer_name']}, "
            f"el {result['date']} a las {result['time']}, "
            f"para {result['num_guests']} personas, "
            f"mesa {result['table_number']} ({result['table_location']}). "
            "Muchas gracias por confiar en nosotros. Procedo a finalizar la llamada. ¡Que tenga un excelente día!"
        )
    except ValueError as ve:
        return str(ve)
    except Exception as exc:
        logger.error("create_reservation failed: %s", exc)
        return "Lo siento, ha ocurrido un error al procesar su reserva. Por favor, inténtelo de nuevo en unos minutos."


@llm.function_tool(
    description=(
        "Cancel an existing reservation. Can cancel by reservation ID, "
        "or by customer name (and optionally phone number)."
    )
)
async def cancel_reservation(
    customer_name: str = "", 
    customer_phone: str = "", 
    reservation_id: int = 0
) -> str:
    """Cancel a reservation."""
    logger.info(
        "Tool: cancel_reservation(name=%s, phone=%s, id=%d)",
        customer_name, customer_phone, reservation_id,
    )
    try:
        rid = reservation_id if reservation_id > 0 else None
        success = db.cancel_reservation(
            reservation_id=rid,
            customer_name=customer_name or None,
            customer_phone=customer_phone or None,
        )
        if success:
            return "La reserva ha sido cancelada correctamente. ¿Puedo ayudarle en algo más?"
        return (
            "No he encontrado ninguna reserva activa con esos datos. "
            "¿Puede facilitarme el nombre o número de reserva?"
        )
    except Exception as exc:
        logger.error("cancel_reservation failed: %s", exc)
        return "Ha ocurrido un error al cancelar la reserva."


@llm.function_tool(
    description=(
        "Get general information about the restaurant: "
        "name, address, opening hours, cuisine type, and special features."
    )
)
async def get_restaurant_info() -> str:
    """Return restaurant details for the customer."""
    logger.info("Tool: get_restaurant_info()")
    try:
        info = db.get_restaurant_info()
        if not info:
            return "No hay información del restaurante disponible en este momento."

        return (
            f"Restaurante: {info['name']}. "
            f"Dirección: {info['address']}. "
            f"Cocina: {info['cuisine_type']}. "
            f"{info['description']} "
            f"Horario de comidas: {info['opening_time_lunch']} a {info['closing_time_lunch']}. "
            f"Horario de cenas: {info['opening_time_dinner']} a {info['closing_time_dinner']}. "
            f"Días abiertos: {info['days_open']}. "
            f"Cerrado: {info['days_closed']}. "
            f"{info.get('special_notes', '')}"
        )
    except Exception as exc:
        logger.error("get_restaurant_info failed: %s", exc)
        return "Error al obtener la información del restaurante."


@llm.function_tool(
    description=(
        "Look up existing reservations for a customer by their phone number. "
        "Use this when a customer wants to check, modify or confirm their reservation."
    )
)
async def find_reservations(
    customer_phone: str
) -> str:
    """Find active reservations by phone number."""
    logger.info("Tool: find_reservations(phone=%s)", customer_phone)
    try:
        reservations = db.find_reservations_by_phone(customer_phone)
        if not reservations:
            return "No he encontrado reservas activas con ese número de teléfono."

        lines = []
        for r in reservations:
            lines.append(
                f"Reserva #{r['id']}: {r['customer_name']}, "
                f"{r['date']} a las {r['time']}, "
                f"{r['num_guests']} personas, mesa {r['table_number']}"
            )
        return "Reservas encontradas:\n" + "\n".join(lines)
    except Exception as exc:
        logger.error("find_reservations failed: %s", exc)
        return "Error al buscar las reservas."


# ---------------------------------------------------------------------------
# System Instructions — Restaurant Personality
# ---------------------------------------------------------------------------

def build_system_prompt() -> str:
    """Build the system prompt dynamically from database config."""
    info = db.get_restaurant_info()
    name = info.get("name", "el restaurante")
    today = datetime.now().strftime("%Y-%m-%d")
    day_name = datetime.now().strftime("%A")

    day_map = {
        "Monday": "lunes", "Tuesday": "martes", "Wednesday": "miércoles",
        "Thursday": "jueves", "Friday": "viernes", "Saturday": "sábado", "Sunday": "domingo",
    }
    day_es = day_map.get(day_name, day_name)

    # Base prompt from DB LLM config
    llm_config = db.get_llm_config()
    base_prompt = llm_config.get("system_prompt", "Eres el asistente telefónico automático del restaurante.")
    
    # Format placeholders if they exist
    base_prompt = base_prompt.replace("{restaurant_name}", name)

    return f"""{base_prompt}

INFORMACIÓN IMPORTANTE:
- Hoy es {day_es}, {today}.
- El restaurante sirve cocina {info.get('cuisine_type', 'mediterránea')}.
- Horario de comidas: {info.get('opening_time_lunch', '13:00')} a {info.get('closing_time_lunch', '16:00')}.
- Horario de cenas: {info.get('opening_time_dinner', '20:00')} a {info.get('closing_time_dinner', '23:30')}.
- Días cerrado: {info.get('days_closed', 'domingo')}.
- Máximo por mesa: {info.get('max_party_size', 10)} personas.

REGLAS DE COMPORTAMIENTO:
1. Siempre habla en español, con tono cálido y profesional.
2. Tu nombre es Nikolina. Al contestar la llamada, SIEMPRE preséntate brevemente: "Hola, soy Nikolina, asistente virtual de {name}. ¿En qué puedo ayudarle?"
3. Si el cliente quiere reservar, pregunta: nombre, fecha, hora y número de comensales.
4. SIEMPRE consulta disponibilidad ANTES de confirmar una reserva (usa check_availability).
5. Confirma todos los datos antes de crear la reserva.
6. Si no hay disponibilidad, sugiere horarios alternativos cercanos.
7. Si preguntan por el menú, dirección u horarios, usa get_restaurant_info.
8. Mantén las respuestas cortas y naturales — esto es una conversación telefónica.
9. No inventes información. Si no sabes algo, di que va a consultarlo con el personal.
10. Al despedirte, agradece la llamada y desea un buen día/noche."""


# ---------------------------------------------------------------------------
# LiveKit Agent Lifecycle
# ---------------------------------------------------------------------------

def prewarm(proc: JobProcess) -> None:
    """Called once when the worker process starts."""
    logger.info("Worker process prewarmed (pid=%s)", os.getpid())


async def entrypoint(ctx: JobContext) -> None:
    try:
        logger.info(f"--- New Agent Session: {ctx.job.id} ---")
        await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

        pipeline_cfg = db.get_active_pipeline_config()
        if not pipeline_cfg:
            logger.warning("No active pipeline configuration found. Fallback to Gemini 2.5 Native.")
            pipeline_cfg = {
                "name": "Fallback Gemini",
                "architecture": "realtime",
                "realtime_model": "gemini-2.5-flash-native-audio-latest",
                "realtime_voice": "Aoede",
                "llm_temperature": 0.7
            }

        architecture = pipeline_cfg.get("architecture", "realtime")
        class SessionTools(llm.ToolContext):
            @llm.function_tool(
                description="Use THIS tool ONLY to hang up, end, or terminate the call when the user says goodbye or no longer needs assistance."
            )
            async def end_call(self):
                """End the current call session physically by disconnecting the room."""
                logger.info("Tool: end_call() invoked. Disconnecting room...")
                asyncio.create_task(ctx.room.disconnect())
                return "Desconectando llamada..."

        # Instantiate dynamic tools wrapper
        dynamic_tools = SessionTools()
        
        agent_tools = [
            check_availability,
            create_reservation,
            cancel_reservation,
            get_restaurant_info,
            find_reservations,
            dynamic_tools, # LiveKit tool context allows appending class instances
        ]

        if architecture == "realtime":
            logger.info(f"Initializing Native Realtime Agent: {pipeline_cfg.get('name')}")
            api_key = os.environ.get("GOOGLE_API_KEY")
            if not api_key:
                logger.error("GOOGLE_API_KEY is not set")
                return

            model = RealtimeModel(
                model=pipeline_cfg.get("realtime_model", "gemini-2.5-flash-native-audio-latest"),
                api_key=api_key,
                voice=pipeline_cfg.get("realtime_voice", "Aoede"),
                instructions=system_prompt,
                temperature=float(pipeline_cfg.get("llm_temperature", 0.7)),
            )
            
            agent = Agent(
                instructions=system_prompt,
                tools=agent_tools,
            )
            session = AgentSession(
                llm=model,
            )
            
        else:
            logger.info(f"Initializing Modular Voice Pipeline: {pipeline_cfg.get('name')}")
            # Load VAD
            vad = None
            try:
                from livekit.plugins import silero
                vad = silero.VAD.load()
            except ImportError:
                logger.warning("Silero VAD not found. Modular pipeline may have degraded turn detection.")

            llm_instance = providers.ProviderFactory.create_llm(
                provider=pipeline_cfg.get("llm_provider", "openai"),
                model=pipeline_cfg.get("llm_model", "gpt-4o"),
                base_url=pipeline_cfg.get("llm_base_url"),
                temperature=float(pipeline_cfg.get("llm_temperature", 0.7)),
            )
            stt_instance = providers.ProviderFactory.create_stt(
                provider=pipeline_cfg.get("stt_provider", "google-stt"),
                model=pipeline_cfg.get("stt_model", "small"),
                language=pipeline_cfg.get("stt_language", "es"),
            )
            tts_instance = providers.ProviderFactory.create_tts(
                provider=pipeline_cfg.get("tts_provider", "kokoro"),
                voice=pipeline_cfg.get("tts_voice", "ef_dora"),
                server_url=pipeline_cfg.get("tts_server_url"),
                speed=float(pipeline_cfg.get("tts_speed", 1.0)),
            )

            agent = Agent(
                instructions=system_prompt,
                tools=agent_tools,
            )
            session = AgentSession(
                stt=stt_instance,
                llm=llm_instance,
                tts=tts_instance,
                vad=vad,
            )

        # Start Session
        logger.info("Starting AgentSession...")
        start_time = datetime.now()
        await session.start(agent=agent, room=ctx.room)

        async def send_initial_greeting():
            await asyncio.sleep(1.0)
            logger.info("Nikolina sending proactive greeting...")
            try:
                await session.generate_reply(
                    instructions="Greet the caller warmly. Introduce yourself as Nikolina, the virtual assistant for the restaurant. Ask how you can help them today with their reservation."
                )
            except Exception as e:
                logger.warning(f"Greeting failed: {e}")

        @ctx.room.on("participant_connected")
        def on_participant_connected(participant):
            logger.info(f"Participant connected: {participant.identity}")
            asyncio.create_task(send_initial_greeting())

        async def log_final_call():
            logger.info("Shutdown: logging call history")
            try:
                end_time = datetime.now()
                duration = int((end_time - start_time).total_seconds())
                db.log_call(
                    room_name=ctx.room.name, 
                    result="unknown", 
                    summary="Llamada cerrada.", 
                    duration_seconds=max(0, duration)
                )
            except Exception as e:
                logger.error(f"Failed to log call: {e}")

        ctx.add_shutdown_callback(log_final_call)

        # If participant is already there
        if ctx.room.remote_participants:
            asyncio.create_task(send_initial_greeting())

        logger.info("Nikolina is fully OPERATIONAL and listening")
        
        # Keep process alive while room is active
        while ctx.room.isconnected():
            await asyncio.sleep(1)

    except Exception as exc:
        logger.error(f"CRITICAL ERROR in entrypoint: {exc}", exc_info=True)
    finally:
        logger.info("Agent process cleanup")




# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            agent_name="msb-assistant",
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
