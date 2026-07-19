"""
Synthetic traffic generator for demos and development.

Live packet capture needs root privileges and an actual attack hitting
your NIC, which isn't practical for a walkthrough or CI. This script
feeds the exact same detector pipeline used in main.py with synthetic
packet dicts that mimic a port scan, a SYN flood, an ICMP flood, and a
suspicious-port connection -- so you can demonstrate detection end-to-end
without touching raw sockets.

Run with:
    python3 traffic_generator.py
"""
import random
import time

from config import config
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


def feed(packet):
    for detector in DETECTORS:
        alert = detector.inspect(packet)
        if alert:
            print(f"[ALERT] {alert['ruleName']} :: {alert['sourceIp']} -> {alert['destIp']}")
            send_alert(alert)


def simulate_port_scan(attacker="203.0.113.45", target="10.0.0.12"):
    print("simulating port scan...")
    for port in random.sample(range(20, 9000), config.PORT_SCAN_UNIQUE_PORTS + 5):
        feed({"src_ip": attacker, "dst_ip": target, "protocol": "TCP",
              "src_port": 51000, "dst_port": port, "flags": "S", "length": 60})
        time.sleep(0.05)


def simulate_dos_flood(attacker="198.51.100.9", target="10.0.0.12"):
    print("simulating DoS / high packet rate...")
    for _ in range(config.DOS_PACKETS_PER_SECOND + 20):
        feed({"src_ip": attacker, "dst_ip": target, "protocol": "TCP",
              "src_port": random.randint(1024, 65535), "dst_port": 80,
              "flags": "S", "length": 60})


def simulate_icmp_flood(attacker="198.51.100.22", target="10.0.0.12"):
    print("simulating ICMP flood...")
    for _ in range(config.ICMP_FLOOD_PACKETS + 10):
        feed({"src_ip": attacker, "dst_ip": target, "protocol": "ICMP",
              "src_port": None, "dst_port": None, "length": 64})


def simulate_suspicious_connection(attacker="192.0.2.77", target="10.0.0.12"):
    print("simulating suspicious port connection...")
    feed({"src_ip": attacker, "dst_ip": target, "protocol": "TCP",
          "src_port": 51122, "dst_port": 4444, "flags": "S", "length": 60})


if __name__ == "__main__":
    simulate_port_scan()
    time.sleep(1)
    simulate_suspicious_connection()
    time.sleep(1)
    simulate_icmp_flood()
    time.sleep(1)
    simulate_dos_flood()
    print("done -- check the dashboard / GET /api/alerts")
