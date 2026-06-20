import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface IncidentAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  asset: string;
  message: string;
  mitreTactic: string;
  sourceIp: string;
  riskScore: number;
}

export function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [alerts, setAlerts] = useState<IncidentAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    const socketInstance = io(url, {
      reconnectionDelayMax: 10000,
      transports: ['websocket'], // Use pure websocket
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setActiveConnections(0);
    });

    socketInstance.on('history', (historyAlerts: IncidentAlert[]) => {
      setAlerts(historyAlerts);
    });

    socketInstance.on('alert', (newAlert: IncidentAlert) => {
      setAlerts((prev) => [newAlert, ...prev].slice(0, 100)); // Keep last 100
    });

    socketInstance.on('metrics', (data: { activeConnections: number }) => {
      setActiveConnections(data.activeConnections);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return { socket, alerts, isConnected, activeConnections };
}
