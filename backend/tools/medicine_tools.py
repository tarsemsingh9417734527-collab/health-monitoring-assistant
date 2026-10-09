from backend.database.database import get_medications


def medication_tool():
    """Get the patient's active medications."""
    return get_medications(active_only=True)