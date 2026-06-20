'use client';
import { IncidentAlert } from '@/hooks/useSocket';
import { Activity, ShieldAlert, Users, Zap } from 'lucide-react';

export default function LiveMetrics({ alerts, activeConnections }: { alerts: IncidentAlert[], activeConnections: number }) {
  const totalAlerts = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  
  // Calculate average risk score
  const avgRisk = totalAlerts > 0 
    ? Math.round(alerts.reduce((acc, curr) => acc + curr.riskScore, 0) / totalAlerts)
    : 0;

  return (
    <div className="grid grid-cols-4 gap-4 w-full mb-4 shrink-0">
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 font-medium mb-1">Total Monitored Events</p>
          <h3 className="text-2xl font-bold text-white">{totalAlerts}</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
          <Activity size={20} />
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between relative overflow-hidden">
        {criticalCount > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>}
        <div>
          <p className="text-sm text-zinc-400 font-medium mb-1">Critical / High Threats</p>
          <h3 className="text-2xl font-bold text-white">
            <span className="text-red-500">{criticalCount}</span> <span className="text-zinc-500 text-lg">/</span> <span className="text-orange-400">{highCount}</span>
          </h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <ShieldAlert size={20} />
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 font-medium mb-1">Avg Risk Score</p>
          <h3 className="text-2xl font-bold text-white">{avgRisk} <span className="text-xs text-zinc-500 font-normal">/ 100</span></h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <Zap size={20} />
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 font-medium mb-1">Active Dashboards</p>
          <h3 className="text-2xl font-bold text-white">{activeConnections}</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <Users size={20} />
        </div>
      </div>
    </div>
  );
}
