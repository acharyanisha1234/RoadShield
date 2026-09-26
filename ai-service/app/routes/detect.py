"""
Accident detection endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional

from app.services.detection_service import detector
from app.utils.image_utils import validate_image, load_image, save_upload
from app.utils.logger import logger

router = APIRouter()


@router.post("/detect")
async def detect_accident(
    file: UploadFile = File(...),
    save: bool = Form(False),
):
    """
    Analyze an image for accident indicators

    - **file**: Image file (JPEG, PNG, WebP, max 5MB)
    - **save**: Whether to save uploaded file

    Returns detection result with confidence and severity
    """
    try:
        content = await file.read()

        # Validate
        is_valid, error = validate_image(content, file.content_type)
        if not is_valid:
            logger.warning(f"Invalid upload: {error}")
            raise HTTPException(status_code=400, detail=error)

        # Optional save
        if save:
            save_upload(content, file.filename or "upload.jpg")

        # Load and analyze
        image = load_image(content)
        result = detector.detect(image)

        return {
            "success": True,
            "filename": file.filename,
            "size_bytes": len(content),
            "result": result,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect/batch")
async def detect_batch(files: list[UploadFile] = File(...)):
    """
    Analyze multiple images at once
    """
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Max 10 files per batch")

    results = []
    for file in files:
        try:
            content = await file.read()
            is_valid, error = validate_image(content, file.content_type)

            if not is_valid:
                results.append({
                    "filename": file.filename,
                    "success": False,
                    "error": error,
                })
                continue

            image = load_image(content)
            result = detector.detect(image)

            results.append({
                "filename": file.filename,
                "success": True,
                "result": result,
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e),
            })

    return {"success": True, "count": len(results), "results": results}