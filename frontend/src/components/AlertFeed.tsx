'use client';
import { IncidentAlert } from '@/hooks/useSocket';
import { format } from 'date-fns';
import { AlertCircle, ShieldAlert, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const severityConfig = {
  LOW: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Shield },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertCircle },
  CRITICAL: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert },
};

export default function AlertFeed({ alerts }: { alerts: IncidentAlert[] }) {
  if (alerts.length === 0) {
    return <div className="text-zinc-500 text-sm">Waiting for alerts...</div>;
  }

  return (
    <div className="flex flex-col gap-3 pr-2 pb-4">
      <AnimatePresence initial={false}>
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          
          return (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex flex-col gap-2 p-3 rounded-lg border ${config.bg} ${config.border} transition-colors hover:bg-white/5 relative overflow-hidden group`}
            >
              {/* Highlight bar for criticals */}
              {alert.severity === 'CRITICAL' && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              )}

              <div className="flex gap-3">
                <div className={`mt-0.5 ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${config.color}`}>
                      {alert.type}
                    </p>
                    <span className="text-[10px] text-zinc-500 shrink-0">
                      {format(new Date(alert.timestamp), 'HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-zinc-400 truncate">
                      Asset: <span className="text-zinc-300">{alert.asset}</span>
                    </p>
                    <p className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/5 text-zinc-400 font-mono">
                      {alert.sourceIp}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-1 pl-7 flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1">
                  MITRE: {alert.mitreTactic}
                </span>
                <span className={`text-[10px] font-bold ${config.color}`}>
                  Risk: {alert.riskScore}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
