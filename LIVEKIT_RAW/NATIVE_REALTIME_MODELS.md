# Native Realtime Models - Installation Guide

This guide covers the installation of Native Realtime voice models for the MSB LiveKit project.

## Available Models

### 1. Kyutai Moshi
- **Type**: Real-time multimodal AI assistant
- **Docker**: `ghcr.io/kyutai/stt:latest` (STT) and `ghcr.io/kyutai/tts:latest` (TTS)
- **Port**: 12000 (STT), 12001 (TTS)
- **Requirements**: GPU with 16GB+ VRAM
- **Status**: Docker images available

### 2. MiniCPM-o 2.6
- **Type**: Multimodal OMNI model
- **GitHub**: https://github.com/OpenBMB/MiniCPM-o
- **Port**: 12001
- **Requirements**: GPU with 24GB+ VRAM
- **Status**: Manual installation required

### 3. Ultravox
- **Type**: Real-time voice AI
- **GitHub**: https://github.com/fixie-ai/ultravox
- **Port**: 12002
- **Requirements**: GPU with 16GB+ VRAM
- **Status**: Manual installation required

### 4. Qwen2-Audio
- **Type**: Audio understanding model
- **Installation**: `ollama pull qwen2-audio:7b-instruct`
- **Port**: 11434 (via Ollama)
- **Requirements**: GPU with 16GB+ VRAM
- **Status**: Available via Ollama

### 5. GLM-4-Voice
- **Type**: Voice conversation model
- **GitHub**: https://github.com/THUDM/GLM-4-Voice
- **Port**: 12004
- **Requirements**: GPU with 24GB+ VRAM
- **Status**: Manual installation required

## Quick Installation

### Via Ollama
```bash
# Qwen2-Audio
ollama pull qwen2-audio:7b-instruct
```

### Via Docker
```bash
# Kyutai Moshi
docker run -d --gpus all -p 12000:12000 ghcr.io/kyutai/stt:latest
docker run -d --gpus all -p 12001:12001 ghcr.io/kyutai/tts:latest
```

## Docker Compose

All AI services can be started with:

```bash
cd /home/ubuntu/LIVEKIT
docker compose -f docker-compose.ai.yml up -d
```

## Port Mapping

| Service | Port | Protocol |
|---------|------|----------|
| Ollama | 11434 | HTTP |
| Faster-Whisper | 9000 | HTTP |
| Coqui TTS | 5002 | HTTP |
| Vosk | 2700 | WebSocket |
| Kokoro (native) | 8001 | HTTP |
| Kyutai Moshi | 12000 | HTTP |
| MiniCPM-o | 12001 | HTTP |
| Ultravox | 12002 | HTTP |
| Qwen2-Audio | 11434 | HTTP (Ollama) |
| GLM-4-Voice | 12004 | HTTP |

## GPU Requirements

- **16GB VRAM**: Llama 3.1/3.2, Qwen 2.5, Phi-3.5, Gemma 2, Hermes 3, SmolLM2, Moshi, Ultravox, Qwen2-Audio
- **24GB VRAM**: Mistral 7B, Gemma 2 9B, MiniCPM-o, GLM-4-Voice
