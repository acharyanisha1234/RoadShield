"""
Health check endpoints
"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "roadshield-ai",
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/ping")
async def ping():
    """Simple ping"""
    return {"pong": True}