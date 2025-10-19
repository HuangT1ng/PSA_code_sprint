import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, Info, Package, Anchor, FileText, Radio, Maximize2, Minimize2 } from 'lucide-react';

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

interface EventTimelineProps {
  showServiceMonitors: boolean;
  onToggleServiceMonitors: () => void;
}

const EventTimeline: React.FC<EventTimelineProps> = ({ showServiceMonitors, onToggleServiceMonitors }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([ALL_LOG_EVENTS[0]]);
  const [_currentIndex, setCurrentIndex] = useState(0);
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
        return { 
          icon: <XCircle className="w-4 h-4" />, 
          color: 'text-red-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-red-500 text-white',
          dotBg: 'bg-red-500'
        };
      case 'WARN':
        return { 
          icon: <AlertTriangle className="w-4 h-4" />, 
          color: 'text-amber-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-amber-500 text-white',
          dotBg: 'bg-amber-500'
        };
      case 'DEBUG':
        return { 
          icon: <Info className="w-4 h-4" />, 
          color: 'text-slate-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-slate-500/20 text-slate-400',
          dotBg: 'bg-white/20'
        };
      default: // INFO
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          color: 'text-emerald-400', 
          bg: 'bg-black/40 backdrop-blur-sm', 
          border: 'border-white/10',
          badge: 'bg-emerald-500/20 text-emerald-400',
          dotBg: 'bg-white/20'
        };
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
      <div className="relative bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

        <div className="relative px-8 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-white" />
              <h2 className="text-2xl font-medium text-white tracking-tight">Centralized Monitor</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                <span className="text-xs font-mono font-medium text-black tracking-wider">LIVE</span>
              </div>
              <button
                onClick={onToggleServiceMonitors}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                title={showServiceMonitors ? "Hide Service Monitors" : "Show Service Monitors"}
              >
                {showServiceMonitors ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="relative h-[600px] overflow-y-auto px-8 pt-6 pb-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) transparent'
          }}
        >
          <div className="space-y-4">
            {events.map((event, index) => {
              const style = getEventStyle(event.level);
              const moduleIcon = getModuleIcon(event.module);
              return (
                <div
                  key={`${event.id}-${index}`}
                  className={`relative pl-10 pb-4 ml-2 ${index !== events.length - 1 ? 'border-l border-white/10' : ''}`}
                  style={{
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className={`absolute left-0 top-0 -ml-[5px] w-[10px] h-[10px] rounded-full ${style.dotBg} border ${style.border}`} />
                  
          <div 
            className={`group p-4 rounded-xl border ${style.border} ${style.bg} cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-mono text-white/60 tracking-tight">{event.time}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="opacity-60">{moduleIcon}</span>
                  <span className="font-medium">{event.service}</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${style.badge}`}>
                  {event.level}
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-sm font-mono font-semibold text-white">{event.action}</span>
              {event.entity && (
                <span className="text-xs font-mono text-white/50 ml-2">→ {event.entity}</span>
              )}
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{event.message}</p>
          </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal/Popup for Event Details - Dark Warp Style */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] animate-in fade-in duration-200"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-[#6b5d4f]/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-medium text-white tracking-tight">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/40 hover:text-white transition-colors rounded-full p-1 hover:bg-white/5"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Timestamp */}
              <div className="flex items-start gap-4 pb-5 border-b border-white/10">
                <Clock className="w-5 h-5 text-white/60 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/50 mb-1 uppercase tracking-wide">Timestamp</p>
                  <p className="text-sm font-mono text-white">{selectedEvent.timestamp}</p>
                </div>
              </div>

              {/* Service & Module */}
              <div className="flex items-start gap-4 pb-5 border-b border-white/10">
                <div className="text-white/60 mt-0.5">
                  {getModuleIcon(selectedEvent.module)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/50 mb-1 uppercase tracking-wide">Service</p>
                  <p className="text-sm text-white font-medium">{selectedEvent.service}</p>
                </div>
              </div>

              {/* Log Level */}
              <div className="flex items-start gap-4 pb-5 border-b border-white/10">
                <div className="text-white/60 mt-0.5">
                  {getEventStyle(selectedEvent.level).icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/50 mb-1 uppercase tracking-wide">Log Level</p>
                  <span className={`inline-block text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded ${getEventStyle(selectedEvent.level).badge}`}>
                    {selectedEvent.level}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pb-5 border-b border-white/10">
                <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Action</p>
                <p className="text-sm font-mono font-semibold text-white">{selectedEvent.action}</p>
              </div>

              {/* Entity */}
              {selectedEvent.entity && (
                <div className="pb-5 border-b border-white/10">
                  <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Entity</p>
                  <p className="text-sm font-mono text-white">{selectedEvent.entity}</p>
                </div>
              )}

              {/* Message */}
              <div className="pb-5 border-b border-white/10">
                <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Message</p>
                <p className="text-sm text-white/80 leading-relaxed">{selectedEvent.message}</p>
              </div>

              {/* Additional Details */}
              {selectedEvent.details && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                  <p className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wide">Additional Details</p>
                  <p className="text-sm font-mono text-white/80 leading-relaxed">{selectedEvent.details}</p>
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
