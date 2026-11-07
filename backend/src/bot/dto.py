from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class PromptModel(BaseModel):
    provider: str
    model: str
    temperature: float
    owner: Optional[str] = ""
    prompt: Optional[str] = None
    sys_prompt: Optional[str] = None
    messages: Optional[List[Dict[str, Any]]] = None
