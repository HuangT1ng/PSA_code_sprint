import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, Info, Package, Anchor, FileText, Radio, Zap } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  time: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  module: 'cntr' | 'vs' | 'ea' | 'api' | 'others';
  action: string;
  entity?: string;
  message: string;
  details?: string;
}

// 10 Business Events from log files
export const ALL_LOG_EVENTS: TimelineEvent[] = [
    {
      id: '1',
      timestamp: '2025-10-03T08:01:12.419Z',
      time: 'Oct 3, 08:01',
      level: 'INFO',
      service: 'EDI Service',
      module: 'ea',
      action: 'COPARN',
      entity: 'REF-COP-0001',
      message: 'EDI message processed successfully',
      details: 'container_id=1, vessel_id=1, duration=45ms'
    },
    {
      id: '2',
      timestamp: '2025-10-03T08:05:32.452Z',
      time: 'Oct 3, 08:05',
      level: 'INFO',
      service: 'EDI Service',
      module: 'ea',
      action: 'COPARN',
      entity: 'REF-COP-0002',
      message: 'EDI message processed successfully',
      details: 'container_id=2, vessel_id=2, duration=40ms'
    },
    {
      id: '3',
      timestamp: '2025-10-04T12:25:10.529Z',
      time: 'Oct 4, 12:25',
      level: 'ERROR',
      service: 'EDI Service',
      module: 'ea',
      action: 'IFTMIN',
      entity: 'REF-IFT-0007',
      message: 'EDI message processing failed - Segment missing',
      details: 'sender=LINE-PSA, receiver=PSA-TOS, code=EDI_ERR_1'
    },
    {
      id: '4',
      timestamp: '2025-10-05T12:35:45.598Z',
      time: 'Oct 5, 12:35',
      level: 'INFO',
      service: 'EDI Service',
      module: 'ea',
      action: 'IFTMIN',
      entity: 'REF-IFT-0010',
      message: 'EDI message processed successfully',
      details: 'container_id=8, vessel_id=8, duration=35ms'
    },
    {
      id: '5',
      timestamp: '2025-10-08T09:14:12.420Z',
      time: 'Oct 8, 09:14',
      level: 'ERROR',
      service: 'Vessel Advice',
      module: 'vs',
      action: 'Create Advice',
      entity: 'MV Lion City 07',
      message: 'System vessel name already in use by active advice',
      details: 'code=VESSEL_ERR_4, status=409'
    },
    {
      id: '6',
      timestamp: '2025-10-09T08:15:12.912Z',
      time: 'Oct 9, 08:15',
      level: 'INFO',
      service: 'Container Service',
      module: 'cntr',
      action: 'Container Update',
      entity: 'CMAU0000020',
      message: 'Container snapshot updated and event published',
      details: 'status=DISCHARGED, correlation_id=corr-cont-0001, latency=187ms'
    },
    {
      id: '7',
      timestamp: '2025-10-09T08:25:33.661Z',
      time: 'Oct 9, 08:25',
      level: 'INFO',
      service: 'API Event Service',
      module: 'api',
      action: 'GATE_IN',
      entity: 'MSCU0000006',
      message: 'Gate-in event processed successfully',
      details: 'gate=B2, truck=SGL1234Z, correlation_id=corr-api-0005, latency=121ms'
    },
    {
      id: '8',
      timestamp: '2025-10-09T08:25:34.112Z',
      time: 'Oct 9, 08:25',
      level: 'INFO',
      service: 'API Event Service',
      module: 'api',
      action: 'LOAD',
      entity: 'MSCU0000007',
      message: 'Container load event processed successfully',
      details: 'stow=11-06-07, correlation_id=corr-api-0006, latency=104ms'
    },
    {
      id: '9',
      timestamp: '2025-10-09T08:30:10.713Z',
      time: 'Oct 9, 08:30',
      level: 'WARN',
      service: 'Vessel Registry',
      module: 'vs',
      action: 'Flag Update',
      entity: 'IMO: 9300007',
      message: 'Vessel flag updated with high frequency warning',
      details: 'Hong Kong → Singapore, last_change=3min, vessel_id=7'
    },
    {
      id: '10',
      timestamp: '2025-10-09T08:35:45.732Z',
      time: 'Oct 9, 08:35',
      level: 'INFO',
      service: 'Berth Application',
      module: 'vs',
      action: 'Berth Lifecycle',
      entity: 'App #2',
      message: 'Berth application lifecycle completed',
      details: 'vessel=MV Lion City 08, reason=SCHEDULE_CHANGE, vessel_advice_no=1000010961'
    },
    {
      id: '11',
      timestamp: '2025-10-09T09:20:15.123Z',
      time: 'Oct 9, 09:20',
      level: 'WARN',
      service: 'Container Service',
      module: 'cntr',
      action: 'Duplicate Snapshot',
      entity: 'TEMU0000045',
      message: 'Duplicate container snapshot attempt detected',
      details: 'existing_created_at=2025-10-09T09:19:58Z, correlation_id=corr-cont-0012'
    },
    {
      id: '12',
      timestamp: '2025-10-09T09:25:30.456Z',
      time: 'Oct 9, 09:25',
      level: 'ERROR',
      service: 'Vessel Advice',
      module: 'vs',
      action: 'Create Advice',
      entity: 'MV Pacific Star',
      message: 'Duplicate vessel name - active advice already exists',
      details: 'code=VESSEL_ERR_4, system_vessel_name="MV Pacific Star", status=409'
    },
    {
      id: '13',
      timestamp: '2025-10-09T09:30:22.789Z',
      time: 'Oct 9, 09:30',
      level: 'INFO',
      service: 'Vessel Registry',
      module: 'vs',
      action: 'Vessel Lookup',
      entity: 'IMO: 9400123',
      message: 'Vessel found in registry cache',
      details: 'vessel_id=15, cache_hit=true, lookup_time=3ms'
    },
    {
      id: '14',
      timestamp: '2025-10-09T09:35:10.234Z',
      time: 'Oct 9, 09:35',
      level: 'INFO',
      service: 'Berth Application',
      module: 'vs',
      action: 'Open Application',
      entity: 'App #5',
      message: 'Berth application opened successfully',
      details: 'vessel=MV Golden Gate, vessel_advice_no=1000010975, application_no=5'
    },
];

const EventTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([ALL_LOG_EVENTS[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ALL_LOG_EVENTS.length;
        
        // If we're starting a new cycle, reset with first event
        if (nextIndex === 0) {
          setEvents([ALL_LOG_EVENTS[0]]);
        } else {
          // Add the next event to the bottom of the chain
          setEvents((prev) => [...prev, ALL_LOG_EVENTS[nextIndex]]);
        }
        
        return nextIndex;
      });
    }, 2000); // Add new event every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new event is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventStyle = (level: string) => {
    switch (level) {
      case 'ERROR':
        return { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-800/40' };
      case 'WARN':
        return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-800/40' };
      case 'DEBUG':
        return { icon: <Info className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-800/30', border: 'border-slate-700/40' };
      default: // INFO
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-800/40' };
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'cntr':
        return <Package className="w-3 h-3" />;
      case 'vs':
        return <Anchor className="w-3 h-3" />;
      case 'ea':
        return <FileText className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  return (
    <>
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />

        <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-xl font-bold text-cyan-400">Real-Time Monitor</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-lg">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">LIVE</span>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="relative h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent px-6 pt-6 pb-2"
        >
          <div className="space-y-3">
            {events.map((event, index) => {
              const style = getEventStyle(event.level);
              const moduleIcon = getModuleIcon(event.module);
              return (
                <div
                  key={`${event.id}-${index}`}
                  className={`relative pl-8 pb-3 ml-2 ${index !== events.length - 1 ? 'border-l-2 border-slate-700/30' : ''}`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className={`absolute left-0 top-0 -ml-2.5 w-5 h-5 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center ${style.color}`}>
                    {style.icon}
                  </div>
                  <div 
                    className={`p-3 rounded-lg border ${style.border} ${style.bg} cursor-pointer hover:border-cyan-600/60 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-900/20`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">{event.time}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          {moduleIcon}
                          <span className="font-semibold">{event.service}</span>
                        </span>
                        <span className={`text-xs font-semibold uppercase ${style.color}`}>
                          {event.level}
                        </span>
                      </div>
                    </div>
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-cyan-400">{event.action}</span>
                      {event.entity && (
                        <span className="text-xs text-slate-400 ml-2">• {event.entity}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-200">{event.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal/Popup for Event Details - Renders at webpage level */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-slate-900 border border-cyan-900/50 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-200">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Timestamp */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Timestamp</p>
                  <p className="text-sm font-mono text-slate-200">{selectedEvent.timestamp}</p>
                </div>
              </div>

              {/* Service & Module */}
              <div className="flex items-center gap-3">
                {getModuleIcon(selectedEvent.module)}
                <div>
                  <p className="text-xs text-slate-400">Service</p>
                  <p className="text-sm text-slate-200">{selectedEvent.service}</p>
                </div>
              </div>

              {/* Log Level */}
              <div className="flex items-center gap-3">
                {getEventStyle(selectedEvent.level).icon}
                <div>
                  <p className="text-xs text-slate-400">Log Level</p>
                  <p className={`text-sm font-semibold uppercase ${getEventStyle(selectedEvent.level).color}`}>
                    {selectedEvent.level}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Action</p>
                <p className="text-sm font-semibold text-cyan-400">{selectedEvent.action}</p>
              </div>

              {/* Entity */}
              {selectedEvent.entity && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Entity</p>
                  <p className="text-sm text-slate-200">{selectedEvent.entity}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Message</p>
                <p className="text-sm text-slate-200">{selectedEvent.message}</p>
              </div>

              {/* Additional Details */}
              {selectedEvent.details && (
                <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Additional Details</p>
                  <p className="text-sm font-mono text-cyan-300">{selectedEvent.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventTimeline;
