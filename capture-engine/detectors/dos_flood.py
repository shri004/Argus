"""
Generic high-packet-rate detector: flags a source IP sending an
abnormally high number of packets per second to any destination --
catches SYN floods, UDP floods, and generic volumetric DoS attempts.
"""
from core.rate_tracker import SlidingWindowCounter
from detectors.base import Detector


class DosFloodDetector(Detector):
    category = "dos"
    rule_name = "High packet rate / possible DoS"
    default_severity = "critical"

    def __init__(self, packets_threshold, window_seconds):
        self.threshold = packets_threshold
        self.tracker = SlidingWindowCounter(window_seconds)
        self._already_alerted = set()

    def inspect(self, packet):
        src = packet["src_ip"]
        count = self.tracker.record(src)

        if count >= self.threshold:
            if src in self._already_alerted:
                return None
            self._already_alerted.add(src)
            return self.build_alert(
                packet,
                severity="critical",
                evidence={"packetCount": count, "windowSeconds": self.tracker.window_seconds},
            )

        if src in self._already_alerted and count < self.threshold / 2:
            self._already_alerted.discard(src)

        return None
