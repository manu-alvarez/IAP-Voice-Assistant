# MSB LiveKit Voice Assistant & Restaurant Management System

## 🚀 Project Overview

This is a high-fidelity restaurant management system that integrates a real-time multimodal voice assistant powered by LiveKit and Google Gemini 2.5 Flash.

### Key Features
- **Voice Assistant**: Real-time voice interaction using WebRTC
- **Restaurant Management**: Table reservations, availability checking, customer management
- **Multi-Provider AI**: Support for multiple LLM, STT, and TTS providers
- **Dashboard**: Administrative interface for business management

---

## 📁 Project Structure

```
MSB_LIVEKIT/
├── agent/                 # Core AI logic and backend
│   ├── agent.py          # LiveKit worker handling AI logic
│   ├── server.py         # FastAPI server for JWT tokens & REST API
│   ├── database.py       # SQLite database management
│   └── requirements.txt # Python dependencies
├── dashboard/            # Admin dashboard (Material Design 3)
├── frontend/            # Client-facing voice UI (WebRTC)
├── dev-dashboard/       # Developer dashboard (Pipeline config)
├── services/            # AI services (Kokoro, etc.)
├── docker-compose.ai.yml # AI services Docker config
├── install_native_realtime.sh # Native Realtime models installation
└── README.md           # This file
```

---

## 🛠️ Tech Stack

### AI & Voice
- **LiveKit Agents**: v1.4.3+ for real-time voice processing
- **LLM Providers**: 
  - Ollama (local): Llama 3.1/3.2, Mistral, Qwen 2.5, Phi-3.5, Gemma 2, Hermes 3, SmolLM2
  - Gemini API: 2.5 Flash, 1.5 Flash
- **STT Providers**:
  - Faster-Whisper (local)
  - Google STT (Gemini)
  - Vosk (local)
- **TTS Providers{
