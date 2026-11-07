from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# modules
import src.groq_api.connect_disconnect_groq as cd_groq

import src.bot.router as bot_router

logger = logging.getLogger("uvicorn.error")


# ========================Lifespan==============================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Connecting to Groq API")
    start_mes = cd_groq.connect_to_groq()
    if start_mes.get("succeed"):
        logger.info("Successfully connected to Groq API. Starting up")
    else:
        logger.error(
            f"Failed to connect to Groq API during startup : {start_mes.get('error')}"
        )

    logger.info("Connected to all APIs successfully")

    yield

    logger.info("Shutting down... Disconnecting from Groq API")
    shut_mes = cd_groq.disconnect_from_groq()
    if shut_mes.get("succeed"):
        logger.info("Successfully disconnected from Groq API")
    else:
        logger.error(
            f"Failed to disconnect from Groq API during shutdown : {shut_mes.get('error')}"
        )

    logger.info("Disconnected form all APIs successfully")


# ================================================================

app = FastAPI(lifespan=lifespan)

# ========================CORS Configuration======================
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://abhisheksahanibuilds.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ================================================================


# ========================Router==================================
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "A simple chatbot that can quickly switch between different LLMs",
        "language": "Python",
        "framework": "FastAPI",
    }


app.include_router(bot_router.bot_route)

# ================================================================
if __name__ == "__main__":
    uvicorn.run(
        "main:app", host="127.0.0.1", port=8000, reload=True, reload_excludes=["env"]
    )
