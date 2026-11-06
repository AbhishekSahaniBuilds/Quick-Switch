from google import genai
from src.utils.settings import app_settings

client = None


def connect_to_gemini():
    global client
    try:
        api_key = app_settings.GEMINI_API
        client = genai.Client(api_key=api_key)
        return {"succeed": 1}

    except Exception as e:
        return {"succeed": 0, "error": str(e)}


def disconnect_from_gemini():
    global client
    if client is None:
        return {"succeed": 1}
    try:
        client = None
        return {"succeed": 1}
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
