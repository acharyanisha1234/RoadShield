"""
Image processing utilities
"""

import io
from pathlib import Path
from typing import Tuple

import numpy as np
from PIL import Image

from app.utils.logger import logger


def validate_image(content: bytes, content_type: str) -> Tuple[bool, str]:
    """
    Validate image content
    Returns (is_valid, error_message)
    """
    from app.config import config

    if content_type not in config.ALLOWED_MIME_TYPES:
        return False, f"Invalid content type: {content_type}"

    if len(content) > config.MAX_IMAGE_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        return False, f"File too large: {size_mb:.2f}MB (max {config.MAX_IMAGE_SIZE_MB}MB)"

    if len(content) < 100:
        return False, "File too small or corrupted"

    return True, ""


def load_image(content: bytes) -> Image.Image:
    """Load image from bytes"""
    return Image.open(io.BytesIO(content)).convert("RGB")


def image_to_array(image: Image.Image, max_size: int = 640) -> np.ndarray:
    """
    Convert PIL Image to numpy array
    Resizes large images to speed up processing
    """
    if max(image.size) > max_size:
        ratio = max_size / max(image.size)
        new_size = tuple(int(dim * ratio) for dim in image.size)
        image = image.resize(new_size, Image.Resampling.LANCZOS)

    return np.array(image)


def image_to_bytes(image: Image.Image, format: str = "JPEG", quality: int = 85) -> bytes:
    """Convert PIL Image back to bytes"""
    buffer = io.BytesIO()
    image.save(buffer, format=format, quality=quality, optimize=True)
    return buffer.getvalue()


def save_upload(content: bytes, filename: str) -> Path:
    """Save uploaded file to disk"""
    from app.config import config

    timestamp = __import__("time").time_ns()
    safe_name = f"{int(timestamp)}_{filename}"
    path = config.UPLOAD_DIR / safe_name

    with open(path, "wb") as f:
        f.write(content)

    logger.info(f"Saved upload: {path}")
    return path