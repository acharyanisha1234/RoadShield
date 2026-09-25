"""
Application configuration
Loads environment variables with defaults
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    """Application configuration"""

    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Upload settings
    MAX_IMAGE_SIZE_MB: int = int(os.getenv("MAX_IMAGE_SIZE_MB", "5"))
    MAX_IMAGE_SIZE_BYTES: int = MAX_IMAGE_SIZE_MB * 1024 * 1024

    UPLOAD_DIR: Path = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")

    # Backend integration
    NODE_BACKEND_URL: str = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")

    # Allowed image formats
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_MIME_TYPES: set = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    @classmethod
    def ensure_dirs(cls):
        """Ensure required directories exist"""
        cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


config = Config()
config.ensure_dirs()