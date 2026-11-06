from groq import Groq
from src.utils.settings import app_settings

client = None


def connect_to_groq():
    global client
    try:
        api_key = app_settings.GROQ_API
        client = Groq(api_key=api_key)
        return {"succeed": 1}

    except Exception as e:
        return {"succeed": 0, "error": str(e)}


def disconnect_from_groq():
    global client
    if client is None:
        return {"succeed": 1}
    try:
        client.close()
        client = None
        return {"succeed": 1}
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
