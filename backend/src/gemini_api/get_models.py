import src.gemini_api.connect_disconnect_gemini as cd_gemini
import src.gemini_api.send_receive_gemini as sr_gemini


def get_gemini_models():
    try:
        gemini_models_output = sr_gemini.get_llms(cd_gemini.client)
        gemini_models = {}

        if gemini_models_output.get("succeed"):
            models_list = gemini_models_output.get("output", [])

            gemini_models["Google"] = []
            for model in models_list:
                full_name = model.name

                clean_name = full_name.removeprefix("models/")

                if "embedding" in clean_name or "transcribe" in clean_name:
                    continue

                gemini_models["Google"].append(clean_name)

    except Exception:
        pass
    else:
        return gemini_models
