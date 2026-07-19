# Argus – Network Security Monitoring Platform

Argus is a full-stack network security monitoring platform that detects suspicious network activity and visualizes security events through a real-time dashboard.

The project uses Python for network traffic detection, a Node.js backend for event processing, MongoDB for storage, and a React dashboard for monitoring alerts and incidents.

## Features

- Real-time security alert dashboard
- Rule-based network traffic detection
- Live alert updates using Socket.IO
- Alert and incident management
- MITRE ATT&CK technique mapping
- Configurable detection rules
- JWT-based authentication

## Tech Stack

**Frontend**

- React.js
- Tailwind CSS
- Socket.IO Client

**Backend**

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.IO

**Detection Engine**

- Python
- Scapy

## Project Structure

```
Argus/
├── client/            # React dashboard
├── server/            # Express API
├── capture-engine/    # Python detection engine
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/argus-security-monitor.git
cd argus-security-monitor
```

### 2. Start MongoDB

Run MongoDB locally or connect to MongoDB Atlas.

### 3. Start the Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 5. Run the Detection Engine

```bash
cd capture-engine
pip install -r requirements.txt
python traffic_generator.py
```

Generate sample traffic to view alerts in the dashboard.

## Future Enhancements

- Live packet capture
- Suricata integration
- Threat intelligence enrichment
- AI-assisted incident summaries
- GeoIP visualization

## License

This project is intended for educational and learning purposes.
