import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  type: 'resolved' | 'detected' | 'critical';
  message: string;
}

const EventTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const eventMessages = {
      resolved: [
        'EDI sync issue resolved',
        'Vessel delay cleared',
        'Port congestion normalized',
        'Authentication restored',
      ],
      detected: [
        'Pattern anomaly detected in container processing',
        'Unusual spike in EDI errors',
        'Multiple vessel delays in sector 7',
      ],
      critical: [
        'Critical system failure: Port gateway',
        'Security breach attempt detected',
        'Major vessel route deviation',
      ],
    };

    const generateEvent = (): TimelineEvent => {
      const types: Array<'resolved' | 'detected' | 'critical'> = ['resolved', 'resolved', 'detected', 'detected', 'critical'];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = eventMessages[type];

      return {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type,
        message: messages[Math.floor(Math.random() * messages.length)],
      };
    };

    const initialEvents = Array(5).fill(null).map(generateEvent);
    setEvents(initialEvents);

    const interval = setInterval(() => {
      setEvents(prev => [generateEvent(), ...prev].slice(0, 8));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-800/40' };
      case 'detected':
        return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-800/40' };
      default:
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-800/40' };
    }
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-200">Event Timeline</h2>
        </div>
      </div>

      <div className="relative h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent p-6">
        <div className="space-y-3">
          {events.map((event, index) => {
            const style = getEventStyle(event.type);
            return (
              <div
                key={event.id}
                className={`relative pl-8 pb-3 ${index !== events.length - 1 ? 'border-l-2 border-slate-700/30 ml-2' : ''}`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div className={`absolute left-0 top-0 -ml-2.5 w-5 h-5 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center ${style.color}`}>
                  {style.icon}
                </div>
                <div className={`p-3 rounded-lg border ${style.border} ${style.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-400">{event.time}</span>
                    <span className={`text-xs font-semibold uppercase ${style.color}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{event.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;
