import os
from dotenv import load_dotenv
load_dotenv()
print(f'API_KEY: {os.getenv("LIVEKIT_API_KEY")}')
print(f'API_SECRET: {os.getenv("LIVEKIT_API_SECRET")[:5]}...')
