FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y gcc portaudio19-dev libasound2-dev libportaudio2 libportaudiocpp0 ffmpeg && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Comando de arranque (el server_venv ya no existe, usamos python global)
CMD ["bash", "-c", "python server.py & python agent.py start"]
