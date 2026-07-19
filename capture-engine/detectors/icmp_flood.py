"""
ICMP flood detector: flags excessive ICMP echo traffic from one source --
the signature of a ping flood / smurf-style attack.
"""
from core.rate_tracker import SlidingWindowCounter
from detectors.base import Detector


class IcmpFloodDetector(Detector):
    category = "icmp_flood"
    rule_name = "ICMP flood detected"
    default_severity = "medium"

    def __init__(self, packets_threshold, window_seconds):
        self.threshold = packets_threshold
        self.tracker = SlidingWindowCounter(window_seconds)
        self._already_alerted = set()

    def inspect(self, packet):
        if packet["protocol"] != "ICMP":
            return None

        src = packet["src_ip"]
        count = self.tracker.record(src)

        if count >= self.threshold:
            if src in self._already_alerted:
                return None
            self._already_alerted.add(src)
            return self.build_alert(
                packet,
                severity="medium",
                evidence={"icmpCount": count, "windowSeconds": self.tracker.window_seconds},
            )

        if src in self._already_alerted and count < self.threshold / 2:
            self._already_alerted.discard(src)

        return None
