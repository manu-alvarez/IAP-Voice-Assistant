#!/bin/bash
echo "Configurando entorno de LiveKit para Mac..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Entorno creado. Para arrancar:"
echo "source venv/bin/activate"
echo "python server.py  # (Servicio Web)"
echo "python agent.py start  # (Agente de Voz)"
