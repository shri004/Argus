"""
Suspicious connection detector: flags traffic to/from ports commonly
associated with known malware C2 channels, backdoors, or IRC-based
botnets (e.g. 4444 = Metasploit default, 31337 = classic backdoor port).
This is a simple denylist -- in a real product this would be backed by
a threat-intel feed, but it demonstrates the pattern cleanly.
"""
from detectors.base import Detector


class SuspiciousConnectionDetector(Detector):
    category = "suspicious_conn"
    rule_name = "Connection to suspicious port"
    default_severity = "high"

    def __init__(self, suspicious_ports: set):
        self.suspicious_ports = suspicious_ports

    def inspect(self, packet):
        if packet["protocol"] not in ("TCP", "UDP"):
            return None

        dst_port = packet.get("dst_port")
        src_port = packet.get("src_port")

        hit_port = None
        if dst_port in self.suspicious_ports:
            hit_port = dst_port
        elif src_port in self.suspicious_ports:
            hit_port = src_port

        if hit_port is None:
            return None

        return self.build_alert(
            packet,
            severity="high",
            evidence={"matchedPort": hit_port},
        )
