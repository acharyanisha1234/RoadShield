"""
Accident detection endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form

from app.services.detection_service import detector
from app.utils.image_utils import validate_image, load_image, save_upload
from app.utils.logger import logger

router = APIRouter()


@router.post("/detect")
async def detect_accident(file: UploadFile = File(...), save: bool = Form(False)):
    try:
        content = await file.read()
        is_valid, error = validate_image(content, file.content_type)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        if save:
            save_upload(content, file.filename or "upload.jpg")
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
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect/batch")
async def detect_batch(files: list[UploadFile] = File(...)):
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Max 10 files")

    results = []
    for file in files:
        try:
            content = await file.read()
            is_valid, error = validate_image(content, file.content_type)

            if not is_valid:
                results.append({"filename": file.filename, "success": False, "error": error})
                continue

            image = load_image(content)
            result = detector.detect(image)

            results.append({"filename": file.filename, "success": True, "result": result})
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e),
            })

    return {"success": True, "count": len(results), "results": results}