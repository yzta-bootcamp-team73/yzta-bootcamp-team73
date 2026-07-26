import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import github_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Kivona ML API",
    description="Kivona eşleştirme ve analiz mikroservisi",
    version="0.1.0",
)

# CORS — Next.js frontend'den gelen isteklere izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github_router.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "kivona-ml-api"}

