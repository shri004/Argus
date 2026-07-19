"""
Entry point for the capture engine.

Run with:
    sudo python3 main.py

(root/admin is required for raw socket access on most OSes -- this is
normal for any packet sniffer, including tcpdump and Wireshark's dumpcap.)
"""
from config import config
from core.sniffer import start_sniffing
from ingest_client import send_alert
from detectors.port_scan import PortScanDetector
from detectors.dos_flood import DosFloodDetector
from detectors.icmp_flood import IcmpFloodDetector
from detectors.suspicious_conn import SuspiciousConnectionDetector

DETECTORS = [
    PortScanDetector(config.PORT_SCAN_UNIQUE_PORTS, config.PORT_SCAN_WINDOW_SECONDS),
    DosFloodDetector(config.DOS_PACKETS_PER_SECOND, config.DOS_WINDOW_SECONDS),
    IcmpFloodDetector(config.ICMP_FLOOD_PACKETS, config.ICMP_FLOOD_WINDOW_SECONDS),
    SuspiciousConnectionDetector(config.SUSPICIOUS_PORTS),
]


def on_packet(packet: dict):
    for detector in DETECTORS:
        alert = detector.inspect(packet)
        if alert:
            print(f"[ALERT] {alert['ruleName']} :: {alert['sourceIp']} -> {alert['destIp']}")
            send_alert(alert)


def main():
    print("Argus capture engine starting")
    print(f"Loaded {len(DETECTORS)} detectors: {[d.rule_name for d in DETECTORS]}")
    start_sniffing(config.INTERFACE, on_packet)


if __name__ == "__main__":
    main()
