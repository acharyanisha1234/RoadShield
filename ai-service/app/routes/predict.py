"""Severity prediction endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.prediction_service import predictor
from app.utils.logger import logger

router = APIRouter()


class FeaturesInput(BaseModel):
    red_ratio: float = Field(default=0.0, ge=0, le=1)
    edge_density: float = Field(default=0.0, ge=0, le=1)
    contrast: float = Field(default=0.0, ge=0, le=1)
    dark_ratio: float = Field(default=0.0, ge=0, le=1)
    brightness: float = Field(default=0.5, ge=0, le=1)
    vehicle_count: int = Field(default=0, ge=0)


@router.post("/predict")
async def predict_severity(features: FeaturesInput):
    try:
        result = predictor.predict(features.model_dump())
        return {"success": True, "features": features.model_dump(), "prediction": result}
    except Exception as e:
        logger.error(f"Predict error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict/batch")
async def predict_batch(items: list[FeaturesInput]):
    if len(items) > 50:
        raise HTTPException(status_code=400, detail="Max 50 items")
    results = []
    for index, item in enumerate(items):
        try:
            result = predictor.predict(item.model_dump())
            results.append({"index": index, "success": True, "prediction": result})
        except Exception as e:
            results.append({"index": index, "success": False, "error": str(e)})
    return {"success": True, "count": len(results), "results": results}