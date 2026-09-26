"""Analytics endpoints for hotspots and report statistics."""

from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.analytics_service import analytics
from app.utils.logger import logger

router = APIRouter()


class ReportInput(BaseModel):
    location: Dict[str, Any]
    severity: str = "medium"
    type: str = "accident"
    status: str = "pending"


class AnalyticsInput(BaseModel):
    reports: List[ReportInput]
    eps_km: float = 0.5
    min_samples: int = 3


@router.post("/analytics/hotspots")
async def get_hotspots(data: AnalyticsInput):
    try:
        reports_dicts = [report.model_dump() for report in data.reports]
        hotspots = analytics.find_hotspots(
            reports_dicts, eps_km=data.eps_km, min_samples=data.min_samples
        )
        return {"success": True, "count": len(hotspots), "hotspots": hotspots}
    except Exception as e:
        logger.error(f"Hotspot error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analytics/stats")
async def get_stats(data: AnalyticsInput):
    try:
        reports_dicts = [report.model_dump() for report in data.reports]
        stats = analytics.compute_statistics(reports_dicts)
        return {"success": True, "stats": stats}
    except Exception as e:
        logger.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))