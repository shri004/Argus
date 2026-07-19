"""
Thin wrapper around scapy.sniff. Keeps main.py free of Scapy specifics
and makes it trivial to swap in a pcap-file replay for testing.
"""
from scapy.all import sniff
from core.packet_parser import parse_packet


def start_sniffing(interface, on_packet):
    def _handle(raw_pkt):
        parsed = parse_packet(raw_pkt)
        if parsed:
            on_packet(parsed)

    print(f"[sniffer] listening on interface '{interface}' (Ctrl+C to stop)")
    sniff(iface=interface, prn=_handle, store=False)
