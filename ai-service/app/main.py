from fastapi import FastAPI

app = FastAPI(
    title="RoadShield AI Service",
    description="AI and OCR support service for RoadShield",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "RoadShield AI Service is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }