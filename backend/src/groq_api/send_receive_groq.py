import groq


def get_llms(client: groq.Groq):
    try:
        model_list = client.models.list()
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": model_list}


def send_prompt(
    client: groq.Groq,
    model: str,
    temperature: float | int,
    prompt: str,
    sys_prompt: str,
):
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=1024,
        )
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": completion}


def send_prompt_with_history(
    client: groq.Groq,
    model: str,
    temperature: float | int,
    messages: list,
):
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=1024,
        )
    except Exception as e:
        return {"succeed": 0, "error": str(e)}
    else:
        return {"succeed": 1, "output": completion}
