# ========Imports=========
from fastapi import APIRouter

# modules
import src.bot.controller as bot_controller
import src.bot.dto as bot_dto

bot_route = APIRouter(prefix="/bot")


@bot_route.get("/get_models")
def get_llms():
    return bot_controller.get_llms()
