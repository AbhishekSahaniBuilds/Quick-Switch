import src.bot.dto as bot_dto

# groq
import src.groq_api.get_models as get_groq_models_module

# gemini
import src.gemini_api.get_models as get_gemini_models_module

# get all models
model_list: dict = None


def get_llms():
    global model_list
    model_list = {}
    try:
        # Groq Models
        try:
            groq_models = get_groq_models_module.get_groq_models()
        except Exception:
            pass
        else:
            model_list["Groq"] = groq_models

        # Gemini Models
        try:
            gemini_models = get_gemini_models_module.get_gemini_models()
        except Exception:
            pass
        else:
            model_list["Gemini"] = gemini_models
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": model_list}
