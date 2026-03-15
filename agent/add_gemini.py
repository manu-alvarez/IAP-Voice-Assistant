import sqlite3

conn = sqlite3.connect('/home/manuel/LIVEKIT_EXPORT/agent/restaurant.db')
cursor = conn.cursor()

# Insertar Gemini 1.5 Flash (Modular)
cursor.execute('''
INSERT OR IGNORE INTO pipeline_configs (
    name, architecture, llm_provider, llm_model, llm_temperature, 
    stt_provider, stt_model, stt_language, 
    tts_provider, tts_voice, tts_speed, is_active
) VALUES (
    'Gemini 1.5 Flash Modular', 'modular', 'gemini', 'gemini-1.5-flash', 0.7, 
    'faster-whisper', 'base', 'es', 
    'kokoro', 'af_aoede', 1.0, 0
)
''')

# Insertar Gemini 1.5 Flash Native
cursor.execute('''
INSERT OR IGNORE INTO pipeline_configs (
    name, architecture, realtime_provider, realtime_model, realtime_voice, 
    google_stt_model, google_tts_voice, is_active
) VALUES (
    'Gemini 1.5 Flash Native', 'realtime', 'gemini', 'gemini-1.5-flash-8b-exp-0924', 'Aoede', 
    'gemini-1.5-flash', 'Aoede', 0
)
''')

# Activar Gemini 1.5 Flash Native por defecto para liberar carga del VPS
cursor.execute('UPDATE pipeline_configs SET is_active = 0')
cursor.execute("UPDATE pipeline_configs SET is_active = 1 WHERE name = 'Gemini 1.5 Flash Native'")

conn.commit()
conn.close()
print("Gemini 1.5 Flash Pipelines añadidos a restaurant.db exitosamente y activado Native.")
