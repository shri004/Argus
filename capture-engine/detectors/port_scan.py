"""
Port scan detector: flags a source IP that touches an unusual number
of distinct destination ports within a short window -- the classic
signature of nmap-style reconnaissance (SYN scan, connect scan, etc).
"""
from core.rate_tracker import UniqueSetTracker
from detectors.base import Detector


class PortScanDetector(Detector):
    category = "port_scan"
    rule_name = "Port scan detected"
    default_severity = "high"

    def __init__(self, unique_port_threshold, window_seconds):
        self.threshold = unique_port_threshold
        self.tracker = UniqueSetTracker(window_seconds)
        self._already_alerted = set()  # avoid re-firing every single packet once threshold is crossed

    def inspect(self, packet):
        if packet["protocol"] not in ("TCP", "UDP"):
            return None
        if not packet["dst_port"]:
            return None

        src = packet["src_ip"]
        unique_ports = self.tracker.record(src, packet["dst_port"])

        if unique_ports >= self.threshold:
            if src in self._already_alerted:
                return None
            self._already_alerted.add(src)
            return self.build_alert(
                packet,
                severity="high",
                evidence={"uniquePortsTouched": unique_ports, "windowSeconds": self.tracker.window_seconds},
            )

        # allow re-alerting after the window naturally cools the source down
        if src in self._already_alerted and unique_ports < self.threshold / 2:
            self._already_alerted.discard(src)

        return None
