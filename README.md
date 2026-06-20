# 🛡️ IncidentView: Live Incident Investigation Dashboard

IncidentView is a real-time, professional-grade Incident Investigation Dashboard designed for Security Operations Center (SOC) War Rooms. It provides critical, low-latency visibility into ongoing security incidents through a sleek, premium interface.

## 🚀 Key Features

- **Live Alert Feed**: A real-time stream of security incidents powered by pure WebSockets, featuring fluid slide-in animations.
- **Event Timeline**: A chronological history of all detected anomalies and events for retroactive analysis.
- **Attack Path Topology**: A dynamic, auto-layout graph visualization (DAG) that maps out attack vectors, compromised assets, and lateral movement paths.
- **Live Metrics KPIs**: Real-time widgets tracking Total Events, Critical/High Threats, Average Risk Scores, and Active Dashboards.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (Premium Dark Mode, Glassmorphism UI)
- **Graph Visualization**: React Flow + Dagre (for Auto-Layouting)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js & Express
- **Real-time Communication**: `Socket.io` (WebSocket transport for low-latency event broadcasting)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Start the Backend (Socket.io Emitter)
Navigate to the `backend` directory, install dependencies, and start the server.
```bash
cd backend
npm install
npm start
```
*Note: The backend runs on `http://localhost:4000` by default and emits simulated SIEM alerts (including IPs, MITRE ATT&CK tactics, and risk scores).*

### 2. Start the Frontend (Next.js Dashboard)
Open a new terminal, navigate to the `frontend` directory, install dependencies, and run the development server.
```bash
cd frontend
npm install
npm run dev
```

### 3. View the Dashboard
Open your browser and navigate to `http://localhost:3000`. You will see the dashboard connect to the backend and begin streaming live security events.

## 🎨 Design Philosophy
The dashboard is built with a deep dark-mode aesthetic, utilizing translucent glass panels, subtle animated radial backgrounds, and dynamic micro-interactions to deliver a "wow" factor while maintaining dense data visibility crucial for SOC analysts.

---
*Built with high-performance, open-source technologies.*
