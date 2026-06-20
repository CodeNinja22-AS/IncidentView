const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev
    methods: ["GET", "POST"]
  }
});

// Mock Data Generator
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const EVENT_TYPES = ['Failed Login', 'Lateral Movement', 'Malware Detected', 'Data Exfiltration', 'Privilege Escalation', 'Suspicious Process', 'Ransomware Activity'];
const ASSETS = ['Web Server 01', 'DB Cluster', 'Admin Workstation', 'Firewall Edge', 'CEO Laptop', 'Active Directory', 'File Share 04'];
const MITRE_TACTICS = ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement'];

function generateIp() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateMockAlert() {
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  
  // Calculate a mock risk score (1-100)
  let baseScore = severity === 'CRITICAL' ? 80 : severity === 'HIGH' ? 60 : severity === 'MEDIUM' ? 30 : 10;
  let riskScore = baseScore + Math.floor(Math.random() * 20);

  return {
    id: `evt-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    severity,
    asset: ASSETS[Math.floor(Math.random() * ASSETS.length)],
    message: `A [${type}] event was flagged by heuristic analysis engines.`,
    mitreTactic: MITRE_TACTICS[Math.floor(Math.random() * MITRE_TACTICS.length)],
    sourceIp: generateIp(),
    riskScore,
  };
}

let activeConnections = 0;

io.on('connection', (socket) => {
  activeConnections++;
  console.log(`[+] Client connected: ${socket.id} | Total: ${activeConnections}`);

  // Emit current metrics
  io.emit('metrics', { activeConnections });

  // Send an initial batch of history
  socket.emit('history', [generateMockAlert(), generateMockAlert(), generateMockAlert(), generateMockAlert()]);

  // Simulate real-time alerts
  const interval = setInterval(() => {
    const alert = generateMockAlert();
    socket.emit('alert', alert);
  }, 4000); // every 4 seconds

  socket.on('disconnect', () => {
    activeConnections--;
    io.emit('metrics', { activeConnections });
    console.log(`[-] Client disconnected: ${socket.id} | Total: ${activeConnections}`);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`[🚀] IncidentView Socket Server (V2) running on port ${PORT}`);
});
