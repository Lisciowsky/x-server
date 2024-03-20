from fastapi import APIRouter

import torch
from TTS.api import TTS

ai_router = APIRouter(prefix="/ai")


@ai_router.get("/")
def generate_file():
    # Get device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # List available 🐸TTS models
    print(TTS().list_models())
    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
    # Run TTS
    # ❗ Since this model is multi-lingual voice cloning model, we must set the target speaker_wav and language
    # Text to speech list of amplitude values as output
    # wav = tts.tts(text="Hello world!", speaker_wav="my/cloning/audio.wav", language="en")
    # Text to speech to a file
    tts.tts_to_file(
        text="This is the example text",
        speaker_wav="./my_voice_recording.wav",
        language="en",
        file_path="output.wav",
    )
