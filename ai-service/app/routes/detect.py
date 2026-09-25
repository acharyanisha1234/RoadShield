from fastapi import APIRouter
router = APIRouter()

@router.post("/detect")
async def detect():
    return {"status": "not_implemented"}