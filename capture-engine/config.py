"""
Central config loader for the capture engine.
Everything a detector needs is read once here and passed down --
no detector reads os.environ directly, which keeps them unit-testable.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _int(key, default):
    return int(os.getenv(key, default))


class Config:
    INTERFACE = os.getenv("INTERFACE", "en0")

    INGEST_URL = os.getenv("INGEST_URL", "http://localhost:5000/api/internal/ingest")
    INGEST_API_KEY = os.getenv("INGEST_API_KEY", "change-me-shared-secret")

    PORT_SCAN_UNIQUE_PORTS = _int("PORT_SCAN_UNIQUE_PORTS", 15)
    PORT_SCAN_WINDOW_SECONDS = _int("PORT_SCAN_WINDOW_SECONDS", 10)

    DOS_PACKETS_PER_SECOND = _int("DOS_PACKETS_PER_SECOND", 200)
    DOS_WINDOW_SECONDS = _int("DOS_WINDOW_SECONDS", 5)

    ICMP_FLOOD_PACKETS = _int("ICMP_FLOOD_PACKETS", 50)
    ICMP_FLOOD_WINDOW_SECONDS = _int("ICMP_FLOOD_WINDOW_SECONDS", 5)

    SUSPICIOUS_PORTS = {
        int(p) for p in os.getenv("SUSPICIOUS_PORTS", "4444,31337,1337,6667,12345").split(",")
    }


config = Config()
