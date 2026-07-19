"""
Every detector implements .inspect(packet) -> dict|None.
Returning a dict means "fire this alert"; the dict is the alert
payload shape the Node ingestion API expects. Returning None means
nothing to report for this packet.
"""
from abc import ABC, abstractmethod


class Detector(ABC):
    category = "generic"
    rule_name = "Generic rule"
    default_severity = "medium"

    @abstractmethod
    def inspect(self, packet: dict) -> dict | None:
        ...

    def build_alert(self, packet, severity=None, evidence=None):
        return {
            "ruleName": self.rule_name,
            "category": self.category,
            "severity": severity or self.default_severity,
            "sourceIp": packet.get("src_ip"),
            "sourcePort": packet.get("src_port"),
            "destIp": packet.get("dst_ip"),
            "destPort": packet.get("dst_port"),
            "protocol": packet.get("protocol"),
            "evidence": evidence or {},
        }
