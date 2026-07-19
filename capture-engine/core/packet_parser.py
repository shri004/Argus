"""
Normalizes a raw Scapy packet into a plain dict.
This is the ONLY file that touches Scapy layer internals directly --
detectors work off the normalized dict, so they never need to know
whether a packet came from Scapy, a pcap replay, or the traffic simulator.
"""
from scapy.layers.inet import IP, TCP, UDP, ICMP


def parse_packet(pkt):
    if IP not in pkt:
        return None

    data = {
        "src_ip": pkt[IP].src,
        "dst_ip": pkt[IP].dst,
        "protocol": None,
        "src_port": None,
        "dst_port": None,
        "flags": None,
        "length": len(pkt),
    }

    if TCP in pkt:
        data["protocol"] = "TCP"
        data["src_port"] = int(pkt[TCP].sport)
        data["dst_port"] = int(pkt[TCP].dport)
        data["flags"] = str(pkt[TCP].flags)
    elif UDP in pkt:
        data["protocol"] = "UDP"
        data["src_port"] = int(pkt[UDP].sport)
        data["dst_port"] = int(pkt[UDP].dport)
    elif ICMP in pkt:
        data["protocol"] = "ICMP"
    else:
        data["protocol"] = "OTHER"

    return data
