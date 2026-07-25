from fastapi import FastAPI
from app.routers import match

app = FastAPI()

app.include_router(match.router)

@app.get("/health")
def read_root():
    return {"status": "ok"}
