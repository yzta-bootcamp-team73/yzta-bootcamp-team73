from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Kivona ML API",
    description="Kivona eşleştirme ve analiz mikroservisi",
    version="0.1.0",
)

# CORS — Next.js frontend'den gelen isteklere izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "kivona-ml-api"}
