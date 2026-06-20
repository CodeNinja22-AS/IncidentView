'use client';
import { IncidentAlert } from '@/hooks/useSocket';
import { format } from 'date-fns';

export default function Timeline({ alerts }: { alerts: IncidentAlert[] }) {
  // Sort alerts chronologically for the timeline (oldest first)
  const timelineEvents = [...alerts].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (timelineEvents.length === 0) {
    return <div className="text-zinc-500 text-sm">No events to display.</div>;
  }

  return (
    <div className="relative pl-4 border-l border-zinc-800 ml-2 space-y-6">
      {timelineEvents.map((event, index) => (
        <div key={`timeline-${event.id}`} className="relative">
          {/* Timeline Node */}
          <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-[#09090b]"></div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-zinc-500">
              {format(new Date(event.timestamp), 'MMM dd, HH:mm:ss')}
            </span>
            <div className="text-sm text-zinc-300">
              <span className="font-medium text-white">{event.type}</span> detected on <span className="text-zinc-400">{event.asset}</span>
            </div>
            <div className="text-xs text-zinc-500 bg-zinc-900/50 p-2 rounded-md mt-1 border border-white/5">
              {event.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
