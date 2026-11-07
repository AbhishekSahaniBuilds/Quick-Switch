from pydantic import BaseModel


class PromptModel(BaseModel):
    provider: str
    owner: str
    model: str
    temperature: float | int = 0.7
    prompt: str
    sys_prompt: str
