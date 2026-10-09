from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2]

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from src.database import (
    init_db,
    get_medications,
    get_dose_log,
    get_metrics,
    get_doses_taken_today,
)


def get_health_summary():
    """Return a basic summary of the user's stored health data."""

    medications = get_medications(active_only=True)
    dose_log = get_dose_log()
    metrics = get_metrics()

    return {
        "active_medications": len(medications),
        "dose_records": len(dose_log),
        "health_metric_records": len(metrics),
    }