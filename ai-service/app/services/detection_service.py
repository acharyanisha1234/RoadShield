"""
Accident detection service
Uses OpenCV-based heuristics + color/texture analysis
"""

import cv2
import numpy as np
from PIL import Image
from typing import Dict, Any

from app.utils.image_utils import image_to_array
from app.utils.logger import logger


class AccidentDetector:
    """
    Detects potential accidents from images
    Uses classical CV techniques (can be replaced with ML model later)
    """

    def __init__(self):
        logger.info("AccidentDetector initialized")

    def detect(self, image: Image.Image) -> Dict[str, Any]:
        """
        Analyze image for accident indicators

        Returns:
            {
                "accident_detected": bool,
                "confidence": float (0-1),
                "severity": "low|medium|high",
                "features": {...},
                "indicators": [...]
            }
        """
        try:
            img_array = image_to_array(image, max_size=640)
            features = self._extract_features(img_array)

            indicators = []
            score = 0.0

            # Heuristic rules
            # 1. High red content → possible accident/bloodlight
            if features["red_ratio"] > 0.15:
                indicators.append("High red color presence")
                score += 0.25

            # 2. High edge density → possible debris/damage
            if features["edge_density"] > 0.15:
                indicators.append("High edge density (debris possible)")
                score += 0.20

            # 3. Low brightness → possibly nighttime accident
            if features["brightness"] < 0.35:
                indicators.append("Low lighting conditions")
                score += 0.10

            # 4. High contrast → chaos
            if features["contrast"] > 0.30:
                indicators.append("High visual contrast")
                score += 0.15

            # 5. Dark spots (skid marks)
            if features["dark_ratio"] > 0.25:
                indicators.append("Dark patch detected")
                score += 0.15

            # 6. Vehicle detection (approximate via contours)
            vehicle_count = self._detect_vehicle_shapes(img_array)
            if vehicle_count > 3:
                indicators.append(f"Multiple vehicles detected ({vehicle_count})")
                score += 0.15

            # Normalize confidence
            confidence = min(score, 1.0)
            accident_detected = confidence >= 0.40

            # Determine severity
            if confidence >= 0.70:
                severity = "high"
            elif confidence >= 0.45:
                severity = "medium"
            else:
                severity = "low"

            result = {
                "accident_detected": accident_detected,
                "confidence": round(confidence, 3),
                "severity": severity,
                "features": features,
                "indicators": indicators,
            }

            logger.info(
                f"Detection: accident={accident_detected}, "
                f"confidence={confidence:.2f}, severity={severity}"
            )

            return result

        except Exception as e:
            logger.error(f"Detection failed: {e}")
            raise

    def _extract_features(self, img_array: np.ndarray) -> Dict[str, float]:
        """Extract color and texture features"""
        h, w = img_array.shape[:2]
        total_pixels = h * w

        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)

        # Red detection (two ranges in HSV)
        lower_red1 = np.array([0, 70, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 70, 50])
        upper_red2 = np.array([180, 255, 255])

        red_mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        red_mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = red_mask1 | red_mask2
        red_ratio = np.sum(red_mask > 0) / total_pixels

        # Dark spots
        dark_mask = gray < 60
        dark_ratio = np.sum(dark_mask) / total_pixels

        # Edge density (Canny)
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges > 0) / total_pixels

        # Brightness
        brightness = float(np.mean(gray)) / 255.0

        # Contrast (std dev)
        contrast = float(np.std(gray)) / 255.0

        return {
            "red_ratio": round(float(red_ratio), 3),
            "dark_ratio": round(float(dark_ratio), 3),
            "edge_density": round(float(edge_density), 3),
            "brightness": round(float(brightness), 3),
            "contrast": round(float(contrast), 3),
            "dimensions": {"width": w, "height": h},
        }

    def _detect_vehicle_shapes(self, img_array: np.ndarray) -> int:
        """
        Approximate vehicle detection using contour analysis
        Counts large rectangular contours
        """
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)

        contours, _ = cv2.findContours(
            edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        h, w = gray.shape
        min_area = (h * w) * 0.01  # 1% of image
        count = 0

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < min_area:
                continue

            # Approximate polygon
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)

            # Vehicle-like shapes: 4-8 vertices, roughly rectangular
            if 4 <= len(approx) <= 8:
                x, y, cw, ch = cv2.boundingRect(cnt)
                aspect = cw / ch if ch > 0 else 0
                if 0.8 <= aspect <= 2.5:
                    count += 1

        return count


# Singleton
detector = AccidentDetector()