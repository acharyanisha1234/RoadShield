"""Severity prediction service."""

from typing import Any, Dict

from app.utils.logger import logger


class SeverityPredictor:
    WEIGHTS = {
        "red_ratio": 0.30,
        "edge_density": 0.20,
        "contrast": 0.15,
        "dark_ratio": 0.15,
        "brightness": -0.10,
        "vehicle_count": 0.10,
    }

    def __init__(self):
        logger.info("SeverityPredictor initialized")

    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        try:
            score = 0.0
            reasoning = []

            red = features.get("red_ratio", 0)
            score += red * self.WEIGHTS["red_ratio"] * 3
            if red > 0.1:
                reasoning.append(f"High red content ({red:.2f})")

            edge = features.get("edge_density", 0)
            score += edge * self.WEIGHTS["edge_density"] * 3
            if edge > 0.12:
                reasoning.append(f"High debris/edge density ({edge:.2f})")

            contrast = features.get("contrast", 0)
            score += contrast * self.WEIGHTS["contrast"]
            if contrast > 0.28:
                reasoning.append(f"High visual chaos ({contrast:.2f})")

            dark = features.get("dark_ratio", 0)
            score += dark * self.WEIGHTS["dark_ratio"]
            if dark > 0.22:
                reasoning.append(f"Significant dark patches ({dark:.2f})")

            brightness = features.get("brightness", 0.5)
            if brightness < 0.35:
                score += 0.10
                reasoning.append(f"Low lighting ({brightness:.2f})")

            vehicles = features.get("vehicle_count", 0)
            if vehicles >= 3:
                score += 0.15
                reasoning.append(f"Multiple vehicles ({vehicles})")

            score = max(0.0, min(score, 1.0))

            if score >= 0.60:
                severity = "high"
            elif score >= 0.35:
                severity = "medium"
            else:
                severity = "low"

            if severity == "high":
                confidence = min(score, 1.0)
            elif severity == "medium":
                confidence = 1.0 - abs(score - 0.475) * 2
            else:
                confidence = 1.0 - score

            confidence = max(0.5, min(confidence, 0.99))

            if not reasoning:
                reasoning.append("No strong severity indicators")

            result = {
                "severity": severity,
                "score": round(score, 3),
                "confidence": round(confidence, 3),
                "reasoning": reasoning,
            }
            logger.info(f"Severity: {severity} (score={score:.2f})")
            return result
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise


predictor = SeverityPredictor()