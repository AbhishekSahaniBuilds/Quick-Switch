import src.bot.dto as bot_dto

# groq
import src.groq_api.get_models as get_groq_models_module
import src.groq_api.send_receive_groq as sr_groq
import src.groq_api.connect_disconnect_groq as cd_groq

# get all models
model_list: dict = None


def get_llms():
    global model_list
    model_list = {}
    try:
        # Groq Models
        try:
            groq_models = get_groq_models_module.get_groq_models()
            model_list["Groq"] = groq_models
        except Exception:
            pass
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": model_list}


def sr_models(discription: bot_dto.PromptModel) -> dict:
    try:
        provider = discription.provider.lower()
        owner = discription.owner.lower() if discription.owner else ""
        temperature = discription.temperature

        prompt = getattr(discription, "prompt", None)
        sys_prompt = getattr(discription, "sys_prompt", None)
        messages = getattr(discription, "messages", None)

        if provider == "groq":
            if owner and not discription.model.startswith(f"{owner}/"):
                full_model_name = f"{owner}/{discription.model}"
            else:
                full_model_name = discription.model

            if messages is not None:
                response = sr_groq.send_prompt_with_history(
                    client=cd_groq.client,
                    model=full_model_name,
                    temperature=temperature,
                    messages=messages,
                )
            else:
                response = sr_groq.send_prompt(
                    client=cd_groq.client,
                    model=full_model_name,
                    temperature=temperature,
                    prompt=prompt,
                    sys_prompt=sys_prompt,
                )

            if response.get("succeed"):
                output = response.get("output")
                if isinstance(output, dict) and "choices" in output:
                    content = output["choices"][0]["message"]["content"]
                elif hasattr(output, "choices"):
                    content = output.choices[0].message.content
                else:
                    content = output
                return {"succeed": 1, "output": content}
            else:
                return {
                    "succeed": 0,
                    "error": response.get(
                        "error", "something went wrong from Groq client invocation"
                    ),
                }

        else:
            return {
                "succeed": 0,
                "error": f"Unknown provider: {provider}. Choose Groq",
            }

    except Exception as e:
        return {"succeed": 0, "error": str(e)}
