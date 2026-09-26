"""Analytics service for hotspots, statistics, and clustering."""

import numpy as np
from sklearn.cluster import DBSCAN
from typing import Any, Dict, List

from app.utils.logger import logger


class AnalyticsService:
    def __init__(self):
        logger.info("AnalyticsService initialized")

    def find_hotspots(
        self,
        reports: List[Dict[str, Any]],
        eps_km: float = 0.5,
        min_samples: int = 3,
    ) -> List[Dict[str, Any]]:
        if len(reports) < min_samples:
            return []
        try:
            coordinates = []
            valid_reports = []
            for report in reports:
                coords = report.get("location", {}).get("coordinates")
                if coords and len(coords) == 2:
                    coordinates.append(coords)
                    valid_reports.append(report)
            if len(coordinates) < min_samples:
                return []

            coords_array = np.array(coordinates)
            kms_per_radian = 6371.0088
            epsilon = eps_km / kms_per_radian
            clustering = DBSCAN(
                eps=epsilon,
                min_samples=min_samples,
                algorithm="ball_tree",
                metric="haversine",
            ).fit(np.radians(coords_array))
            labels = clustering.labels_
            hotspots = []
            for label in set(labels):
                if label == -1:
                    continue
                indices = np.where(labels == label)[0]
                cluster_reports = [valid_reports[i] for i in indices]
                center = coords_array[indices].mean(axis=0)
                severities = {"low": 0, "medium": 0, "high": 0}
                for report in cluster_reports:
                    severity = report.get("severity", "medium")
                    if severity in severities:
                        severities[severity] += 1
                hotspots.append({
                    "center": {
                        "longitude": round(float(center[0]), 6),
                        "latitude": round(float(center[1]), 6),
                    },
                    "count": len(cluster_reports),
                    "radius_km": round(eps_km, 2),
                    "severities": severities,
                    "risk_level": self._calc_risk(severities, len(cluster_reports)),
                })

            hotspots.sort(key=lambda hotspot: hotspot["count"], reverse=True)
            logger.info(f"Found {len(hotspots)} hotspots")
            return hotspots
        except Exception as e:
            logger.error(f"Hotspot analysis failed: {e}")
            raise

    def _calc_risk(self, severities: Dict[str, int], total: int) -> str:
        high = severities.get("high", 0)
        medium = severities.get("medium", 0)
        if high >= 3 or (high >= 1 and total >= 5):
            return "critical"
        if high >= 1 or medium >= 3:
            return "high"
        if medium >= 1 or total >= 3:
            return "medium"
        return "low"

    def compute_statistics(self, reports: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not reports:
            return {
                "total": 0,
                "by_severity": {"low": 0, "medium": 0, "high": 0},
                "by_type": {},
                "by_status": {},
            }

        by_severity = {"low": 0, "medium": 0, "high": 0}
        by_type = {}
        by_status = {}
        for report in reports:
            severity = report.get("severity", "medium")
            if severity in by_severity:
                by_severity[severity] += 1
            report_type = report.get("type", "other")
            by_type[report_type] = by_type.get(report_type, 0) + 1
            status = report.get("status", "pending")
            by_status[status] = by_status.get(status, 0) + 1

        return {
            "total": len(reports),
            "by_severity": by_severity,
            "by_type": by_type,
            "by_status": by_status,
        }


analytics = AnalyticsService()