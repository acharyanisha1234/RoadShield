"""
RoadShield AI Service
FastAPI application entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

from app.config import config
from app.utils.logger import logger

# Import routers
from app.routes import health, detect, predict, analytics

# -------- APP SETUP --------
app = FastAPI(
    title="RoadShield AI Service",
    description="AI-powered accident detection and severity analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- ROUTES --------
app.include_router(health.router, prefix="/ai", tags=["Health"])
app.include_router(detect.router, prefix="/ai", tags=["Detection"])
app.include_router(predict.router, prefix="/ai", tags=["Prediction"])
app.include_router(analytics.router, prefix="/ai", tags=["Analytics"])


# -------- STARTUP --------
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 60)
    logger.info("RoadShield AI Service starting...")
    logger.info(f"Environment: {config.ENVIRONMENT}")
    logger.info(f"Port: {config.PORT}")
    logger.info(f"Upload dir: {config.UPLOAD_DIR}")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("RoadShield AI Service shutting down...")


# -------- ROOT --------
@app.get("/")
async def root():
    return {
        "service": "RoadShield AI",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/docs",
    }


# -------- EXCEPTION HANDLER --------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc),
            "path": str(request.url),
        },
    )