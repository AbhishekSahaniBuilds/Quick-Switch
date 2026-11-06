import src.groq_api.connect_disconnect_groq as cd_groq
import src.groq_api.send_receive_groq as sr_groq


def get_groq_models():
    try:
        groq_models_output = sr_groq.get_llms(cd_groq.client)
        groq_models = {}
        if groq_models_output.get("succeed"):
            output_list = list(groq_models_output.get("output", []))
            if output_list:
                for model in output_list[0][1]:
                    model_dict = dict(model)
                    owner = model_dict.get("owned_by")
                    name = model_dict.get("name")
                    if owner in groq_models:
                        groq_models[owner].append(name)
                    else:
                        groq_models[owner] = [name]

    except Exception:
        pass
    else:
        return groq_models
