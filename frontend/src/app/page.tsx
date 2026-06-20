'use client';
import { useSocket } from '@/hooks/useSocket';
import AlertFeed from '@/components/AlertFeed';
import Timeline from '@/components/Timeline';
import AttackGraph from '@/components/AttackGraph';
import LiveMetrics from '@/components/LiveMetrics';

export default function Home() {
  // Connect to the mock Socket.io backend
  const { alerts, isConnected, activeConnections } = useSocket('http://localhost:4000');

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#09090b] text-zinc-100 p-4 relative">
      {/* Animated subtle radial background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background pointer-events-none"></div>
      
      <header className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">IncidentView</h1>
          <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
            LIVE
          </span>
          <span className={`text-xs flex items-center gap-1 ml-4 ${isConnected ? 'text-green-500' : 'text-zinc-500'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]' : 'bg-zinc-500'}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
        <div className="text-sm text-zinc-400">
          SOC War Room Alpha
        </div>
      </header>

      {/* V2 Live Metrics Row */}
      <div className="relative z-10">
        <LiveMetrics alerts={alerts} activeConnections={activeConnections} />
      </div>

      <div className="relative z-10 grid grid-cols-12 gap-4 h-full min-h-0">
        {/* Left Column: Timeline & Alerts */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="glass-panel flex-1 rounded-xl p-4 overflow-hidden flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2 shrink-0">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              Alert Feed
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AlertFeed alerts={alerts} />
            </div>
          </div>
          
          <div className="glass-panel flex-1 rounded-xl p-4 overflow-hidden flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2 shrink-0">
              <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              Event Timeline
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Timeline alerts={alerts} />
            </div>
          </div>
        </div>

        {/* Right Column: Attack Path Graph */}
        <div className="col-span-8 glass-panel rounded-xl overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              Attack Topology
            </h2>
          </div>
          <div className="w-full h-full">
            <AttackGraph alerts={alerts} />
          </div>
        </div>
      </div>
    </main>
  );
}
