from google import genai
from google.genai import types


def get_llms(client: genai.Client):
    try:
        model_list = client.models.list()
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": model_list}


def send_prompt(
    client: genai.Client,
    model: str,
    temperature: float | int,
    prompt: str,
    sys_prompt: str,
):
    try:
        config = types.GenerateContentConfig(
            temperature=float(temperature),
            system_instruction=sys_prompt if sys_prompt else None,
        )

        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=config,
        )
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": response}
