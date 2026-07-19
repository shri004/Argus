"""
Sliding-window counters shared by the rate-based detectors
(DoS flood, ICMP flood, port scan). Keeping this generic means
each detector just asks "how many events for key X in the last N seconds?"
instead of re-implementing its own bookkeeping.
"""
import time
from collections import defaultdict, deque


class SlidingWindowCounter:
    def __init__(self, window_seconds):
        self.window_seconds = window_seconds
        self._events = defaultdict(deque)  # key -> deque[timestamps]

    def record(self, key, ts=None):
        ts = ts or time.time()
        dq = self._events[key]
        dq.append(ts)
        self._evict(dq, ts)
        return len(dq)

    def count(self, key):
        dq = self._events[key]
        self._evict(dq, time.time())
        return len(dq)

    def _evict(self, dq, now):
        cutoff = now - self.window_seconds
        while dq and dq[0] < cutoff:
            dq.popleft()


class UniqueSetTracker:
    """Tracks unique values (e.g. unique dest ports hit by one source IP) in a window."""

    def __init__(self, window_seconds):
        self.window_seconds = window_seconds
        self._events = defaultdict(deque)  # key -> deque[(timestamp, value)]

    def record(self, key, value, ts=None):
        ts = ts or time.time()
        dq = self._events[key]
        dq.append((ts, value))
        self._evict(dq, ts)
        return len({v for _, v in dq})

    def _evict(self, dq, now):
        cutoff = now - self.window_seconds
        while dq and dq[0][0] < cutoff:
            dq.popleft()
