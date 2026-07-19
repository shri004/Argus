# Argus — Network Intrusion Detection & Monitoring Platform

A rule-based network intrusion detection system with a real-time enterprise
security dashboard. Python/Scapy sensor → Node/Express API → MongoDB →
React dashboard, wired together with a WebSocket live feed.

```
capture-engine/   Python sensor: packet capture + detection rules
server/           Node/Express API: ingestion, alerts, incidents, auth, WebSocket
client/           React + Tailwind dashboard
docker-compose.yml  Spins up MongoDB (and optionally the API) for local dev
```

## 1. Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (via Docker, or a local install, or Atlas)
- Docker + Docker Compose (recommended, for MongoDB only)

## 2. Start MongoDB

```bash
docker compose up -d mongo
```

This starts MongoDB on `localhost:27017`. (You can instead point `MONGO_URI`
at any MongoDB instance, including Atlas.)

## 3. Start the API server

```bash
cd server
cp .env.example .env      # edit if needed
npm install
npm run seed               # seeds the 4 built-in detection rules
npm run dev                # starts on http://localhost:5000
```

Create a login user (there's no public signup page by design — an analyst
account is provisioned by an admin):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@argus.local","password":"changeme123","role":"admin"}'
```

## 4. Start the React dashboard

```bash
cd client
cp .env.example .env      # defaults already point at localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

Log in with the account you created in step 3.

## 5. Feed it traffic

**Option A — synthetic demo traffic (no root required, works anywhere):**

```bash
cd capture-engine
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 traffic_generator.py
```

This runs synthetic port-scan, DoS, ICMP-flood, and suspicious-connection
traffic through the exact same detector code the live sniffer uses, and
posts the resulting alerts to your running API. Watch them land on the
dashboard in real time via the WebSocket feed.

**Option B — live packet capture (requires root/admin + a real NIC):**

```bash
cd capture-engine
source venv/bin/activate
# find your interface name first: `ifconfig` (mac/linux) or `ipconfig` (windows)
sudo python3 main.py
```

Live capture needs raw socket access, which is why it needs elevated
privileges — this is standard for any packet sniffer (tcpdump, Wireshark's
dumpcap, etc.), not specific to this project.

## Architecture notes (for interviews / write-ups)

- **The Python sensor never talks to MongoDB.** It only POSTs normalized
  detection events to a Node ingestion endpoint, authenticated by a shared
  API key. This keeps the sensor swappable (you could point a Suricata or
  Zeek feed at the same ingestion endpoint) and keeps all business logic —
  deduplication, enrichment, persistence — in one place.
- **Alert deduplication/collapsing** happens server-side in
  `server/src/services/detectionService.js`: repeated hits from the same
  source IP on the same rule within a 60s window increment an
  `occurrenceCount` on one alert document instead of spamming the feed with
  near-duplicates — the same problem every real SIEM has to solve for alert
  fatigue.
- **Rules are data, not code.** Thresholds live in MongoDB (`Rule` model)
  and are editable from the dashboard without redeploying the sensor. The
  Python detectors currently read thresholds from `.env` at boot — a
  natural next step is having `main.py` pull `/api/rules` on startup so the
  dashboard becomes the actual source of truth.
- **Live feed vs. history** — WebSocket (Socket.IO) pushes new alerts
  instantly to every connected dashboard; REST endpoints serve filtered,
  paginated historical queries. This mirrors how CrowdStrike/Datadog-style
  consoles separate "what's happening now" from "what happened."
- **MITRE ATT&CK tagging** — each seeded rule carries a `mitreTechnique`
  field (e.g. `T1046 - Network Service Discovery`), which is a detail that
  signals real security-engineering literacy in an interview.

## Suggested next additions

- AI-assisted incident summaries: a button on an Incident that calls the
  Claude API with the linked alerts and returns a plain-English summary +
  recommended response — deterministic detection, LLM-assisted triage.
- PDF incident export (via the pdf skill / a report template).
- GeoIP enrichment on ingest (`geo.country` / `geo.city` fields already
  exist on the Alert model, just unpopulated).
- Full RBAC enforcement on mutating routes (`requireAuth` / `requireRole`
  middleware already exist in `server/src/middleware/auth.js` — apply them
  to the alert/incident/rule routers once you're ready to lock the API down).
