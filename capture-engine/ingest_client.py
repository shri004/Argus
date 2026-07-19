"""
Posts a detected alert to the Node ingestion API. Fire-and-forget with
a short timeout so a slow/down API never blocks packet processing --
detection must keep running even if the backend hiccups.
"""
import requests
from config import config


def send_alert(alert: dict):
    try:
        resp = requests.post(
            config.INGEST_URL,
            json=alert,
            headers={"x-api-key": config.INGEST_API_KEY},
            timeout=2,
        )
        if resp.status_code >= 300:
            print(f"[ingest] non-2xx response {resp.status_code}: {resp.text[:200]}")
    except requests.RequestException as e:
        print(f"[ingest] failed to reach API: {e}")
