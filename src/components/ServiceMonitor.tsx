import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Info, Clock } from 'lucide-react';
import { ALL_LOG_EVENTS } from './RealTimeMonitor';

interface LogEvent {
  id: string;
  timestamp: string;
  time: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  module: string;
  action: string;
  entity?: string;
  message: string;
  details?: string;
}

interface ServiceMonitorProps {
  serviceName: string;
  logData: string;
  icon: React.ReactNode;
  color: string;
}

// Parse API Event Service logs
const parseApiEventLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  // Extract event details
  const eventTypeMatch = rest.match(/event_type=(\S+)/);
  const cntrNoMatch = rest.match(/cntr_no=(\S+)/);
  const correlationIdMatch = rest.match(/correlation_id=(\S+)/);
  const statusMatch = rest.match(/status=(\d+)/);
  const errorMatch = rest.match(/error="([^"]+)"/);
  const messageMatch = rest.match(/message="([^"]+)"/);
  
  let action = '';
  let entity = undefined;
  let message = '';
  let details = undefined;
  
  if (rest.includes('Boot')) {
    action = 'Service Start';
    message = 'API Event Service started';
    details = rest.match(/version=([^\s]+).*commit=([^\s]+)/)?.[0];
  } else if (rest.includes('ScheduleLoaded')) {
    action = 'Scheduler';
    message = 'Job scheduler loaded';
    const jobsMatch = rest.match(/jobs=(\d+)/);
    details = jobsMatch ? `jobs=${jobsMatch[1]}` : undefined;
  } else if (rest.includes('Persist') && (rest.includes('attempt') || rest.includes('api_event_id'))) {
    const typeMatch = rest.match(/type=(\S+)/);
    action = typeMatch ? typeMatch[1] : 'Persist Event';
    const containerIdMatch = rest.match(/container_id=(\d+)/);
    entity = containerIdMatch ? `container_id=${containerIdMatch[1]}` : undefined;
    
    if (rest.includes('attempt') && errorMatch) {
      message = errorMatch[1];
      const attemptMatch = rest.match(/attempt=(\d+)/);
      details = attemptMatch ? `attempt=${attemptMatch[1]}` : undefined;
    } else {
      message = messageMatch ? messageMatch[1] : 'Event persisted to database';
      const apiIdMatch = rest.match(/api_event_id=(\d+)/);
      const detailParts = [];
      if (apiIdMatch) detailParts.push(apiIdMatch[0]);
      if (statusMatch) detailParts.push(`status=${statusMatch[1]}`);
      details = detailParts.join(', ');
    }
  } else if (eventTypeMatch) {
    action = eventTypeMatch[1];
    entity = cntrNoMatch ? cntrNoMatch[1] : undefined;
    if (errorMatch || (statusMatch && (statusMatch[1] === '401' || statusMatch[1] === '504'))) {
      message = errorMatch ? errorMatch[1] : messageMatch ? messageMatch[1] : 'Request failed';
    } else {
      message = `${action} event processed successfully`;
    }
    const detailParts = [];
    if (correlationIdMatch) detailParts.push(correlationIdMatch[0]);
    if (statusMatch) detailParts.push(`status=${statusMatch[1]}`);
    const jsonMatch = rest.match(/\{[^}]+\}/);
    if (jsonMatch) detailParts.push(jsonMatch[0]);
    details = detailParts.join(', ');
  } else if (module === 'http') {
    const httpMatch = rest.match(/(\d+)\s+(GET|POST|PATCH|PUT|DELETE)\s+(\S+)/);
    if (httpMatch) {
      const statusCode = httpMatch[1];
      const method = httpMatch[2];
      const endpoint = httpMatch[3];
      action = method;
      entity = endpoint;
      
      // Determine message based on status code
      if (statusCode.startsWith('2')) {
        message = `Request completed successfully`;
      } else if (statusCode === '401') {
        message = 'Authentication failed';
      } else if (statusCode === '504') {
        message = 'Gateway Timeout - partner endpoint unresponsive';
      } else {
        message = `Request failed with status ${statusCode}`;
      }
      
      const latencyMatch = rest.match(/latency_ms=(\d+)/);
      const traceMatch = rest.match(/trace_id=(\S+)/);
      const detailParts = [`status=${statusCode}`];
      if (latencyMatch) detailParts.push(`latency_ms=${latencyMatch[1]}`);
      if (traceMatch) detailParts.push(traceMatch[0]);
      details = detailParts.join(', ');
    }
  } else if (rest.includes('Retrying') || rest.includes('retry')) {
    action = 'Retry';
    message = 'Retrying request after failure';
    const attemptMatch = rest.match(/attempt (\d+\/\d+)/);
    details = attemptMatch ? attemptMatch[0] : rest.match(/in (\d+s)/)?.[0];
  } else if (rest.includes('alert-service') || rest.includes('Triggered')) {
    action = 'Alert';
    const alertMatch = rest.match(/alert_id=(\S+)/);
    entity = alertMatch ? alertMatch[1] : undefined;
    message = 'Critical alert triggered';
    const severityMatch = rest.match(/severity=(\S+)/);
    const reasonMatch = rest.match(/reason="([^"]+)"/);
    const detailParts = [];
    if (severityMatch) detailParts.push(severityMatch[0]);
    if (reasonMatch) detailParts.push(`reason="${reasonMatch[1]}"`);
    details = detailParts.join(', ');
  } else if (rest.includes('Request failed') || rest.includes('Request timeout')) {
    const methodMatch = rest.match(/(POST|GET|PATCH|PUT|DELETE)\s+(\S+)/);
    if (methodMatch) {
      action = methodMatch[1];
      entity = methodMatch[2];
    } else {
      action = 'API Request';
    }
    if (rest.includes('timeout')) {
      message = 'Request timeout - endpoint unresponsive';
      const latencyMatch = rest.match(/latency_ms=(\d+)/);
      details = latencyMatch ? `latency_ms=${latencyMatch[1]}` : undefined;
    } else {
      const msgMatch = rest.match(/message="([^"]+)"/);
      message = msgMatch ? msgMatch[1] : 'Request failed';
      const statusMatch = rest.match(/status=(\d+)/);
      details = statusMatch ? `status=${statusMatch[1]}` : undefined;
    }
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

// Parse Berth Application logs
const parseBerthLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  const appNoMatch = rest.match(/application_no=(\d+)/);
  const vesselAdviceMatch = rest.match(/vessel_advice_no=(\d+)/);
  const vesselNameMatch = rest.match(/system_vessel_name="([^"]+)"/);
  const reasonMatch = rest.match(/reason=(\S+)/);
  const latencyMatch = rest.match(/latency_ms=(\d+)/);
  
  let action = 'Berth Operation';
  let entity = appNoMatch ? `App #${appNoMatch[1]}` : undefined;
  let message = '';
  let details = undefined;
  
  if (rest.includes('Boot')) {
    action = 'Service Start';
    entity = undefined;
    message = 'Berth Application Service started';
    details = rest.match(/version=([^\s]+)/)?.[0];
  } else if (rest.includes('FetchActive')) {
    action = 'Fetch Active Advice';
    entity = vesselNameMatch ? vesselNameMatch[1] : undefined;
    message = 'Retrieved active vessel advice';
    details = vesselAdviceMatch ? `vessel_advice_no=${vesselAdviceMatch[1]}` : undefined;
  } else if (rest.includes('OpenApplication')) {
    action = 'Open Application';
    message = 'Berth application opened';
    details = `${vesselAdviceMatch?.[0]}, ${appNoMatch?.[0]}`;
  } else if (rest.includes('CloseApplication')) {
    action = 'Close Application';
    message = 'Berth application closed';
    details = reasonMatch ? `reason=${reasonMatch[1]}` : undefined;
  } else if (rest.includes('ArchiveApplication')) {
    action = 'Archive Application';
    message = 'Berth application archived';
    details = rest.match(/deleted=(\S+)/)?.[0];
  } else if (module === 'http' || rest.includes('http')) {
    const httpMatch = rest.match(/(\d+)\s+(POST|PATCH)/);
    action = httpMatch ? `HTTP ${httpMatch[2]}` : 'HTTP Request';
    message = `Operation completed`;
    details = latencyMatch ? `latency_ms=${latencyMatch[1]}` : undefined;
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

// Parse Container Service logs
const parseContainerLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  const cntrNoMatch = rest.match(/cntr_no=(\S+)/);
  const statusMatch = rest.match(/status=(\S+)/);
  const correlationIdMatch = rest.match(/correlation_id=(\S+)/);
  const latencyMatch = rest.match(/latency_ms=(\d+)/);
  
  let action = 'Container Operation';
  let entity = cntrNoMatch ? cntrNoMatch[1] : undefined;
  let message = '';
  let details = undefined;
  
  if (rest.includes('Started')) {
    action = 'Service Start';
    entity = undefined;
    message = 'Container Service started';
    details = rest.match(/version=([^\s]+).*build=([^\s]+)/)?.[0];
  } else if (rest.includes('Flyway')) {
    action = 'Database Migration';
    entity = undefined;
    message = 'Database schema baseline complete';
    details = rest.match(/schema=(\S+).*version=([^\s]+)/)?.[0];
  } else if (rest.includes('FetchLatestSnapshot')) {
    action = 'Fetch Snapshot';
    message = 'Retrieved latest container snapshot';
  } else if (rest.includes('InsertSnapshot')) {
    action = 'Insert Snapshot';
    message = 'Container snapshot created';
    details = statusMatch?.[0];
  } else if (rest.includes('DuplicateSnapshotAttempt')) {
    action = 'Duplicate Warning';
    message = 'Duplicate snapshot attempt detected';
    details = rest.match(/existing_created_at=([^\s]+)/)?.[0];
  } else if (rest.includes('PublishEvent')) {
    action = 'Publish Event';
    message = 'Container update event published';
    details = correlationIdMatch?.[0];
  } else if (module === 'http' || rest.includes('http')) {
    action = 'HTTP POST';
    message = 'Container snapshot updated and event published';
    details = latencyMatch ? `latency_ms=${latencyMatch[1]}` : undefined;
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

// Parse EDI Advice logs
const parseEdiLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  const messageTypeMatch = rest.match(/messageType="([^"]+)"/);
  const corrIdMatch = rest.match(/corrId=(\S+)/);
  const msgMatch = rest.match(/msg="([^"]+)"/);
  const codeMatch = rest.match(/code=(\S+)/);
  const durationMatch = rest.match(/durationMs=(\d+)/);
  const statusMatch = rest.match(/httpStatus=(\d+)/);
  
  let action = messageTypeMatch ? messageTypeMatch[1] : 'EDI Operation';
  let entity = undefined;
  let message = '';
  let details = corrIdMatch?.[0];
  
  if (rest.includes('EDIController') && rest.includes('httpMethod')) {
    action = 'Receive EDI';
    entity = messageTypeMatch ? messageTypeMatch[1] : undefined;
    message = 'EDI message received';
    const httpMatch = rest.match(/httpMethod=(\S+)\s+path="([^"]+)"/);
    if (httpMatch) details = `${httpMatch[1]} ${httpMatch[2]}`;
  } else if (rest.includes('processIncoming')) {
    action = messageTypeMatch ? messageTypeMatch[1] : 'Process';
    message = `Processing ${action} message`;
  } else if (msgMatch && codeMatch) {
    action = messageTypeMatch ? messageTypeMatch[1] : 'EDI Error';
    entity = codeMatch[1];
    message = msgMatch[1];
    details = rest.match(/sender="([^"]+)".*receiver="([^"]+)"/)?.[0];
  } else if (statusMatch) {
    action = 'Response';
    message = statusMatch[1] === '200' ? 'EDI message processed successfully' : 'EDI processing failed';
    details = durationMatch ? `durationMs=${durationMatch[1]}` : undefined;
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

// Parse Vessel Advice logs
const parseVesselAdviceLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  const vesselNameMatch = rest.match(/vesselName="([^"]+)"/);
  const systemVesselNameMatch = rest.match(/system_vessel_name="([^"]+)"/);
  const codeMatch = rest.match(/code=(\S+)/);
  const msgMatch = rest.match(/msg="([^"]+)"/);
  const statusMatch = rest.match(/httpStatus=(\d+)/);
  
  let action = 'Vessel Advice';
  let entity = vesselNameMatch ? vesselNameMatch[1] : systemVesselNameMatch ? systemVesselNameMatch[1] : undefined;
  let message = '';
  let details = undefined;
  
  if (rest.includes('prepareCreate')) {
    action = 'Create Advice';
    message = 'Preparing to create vessel advice';
    details = rest.match(/effStart=([^\s]+)/)?.[0];
  } else if (codeMatch && msgMatch) {
    action = 'Validation Error';
    entity = codeMatch[1];
    message = msgMatch[1];
    details = `system_vessel_name="${systemVesselNameMatch?.[1]}", adviceState=ACTIVE`;
  } else if (statusMatch) {
    action = 'Response';
    message = statusMatch[1] === '409' ? 'System vessel name already in use by active advice' : 'Operation completed';
    details = `status=${statusMatch[1]}`;
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

// Parse Vessel Registry logs
const parseVesselRegistryLog = (line: string, index: number, serviceName: string): LogEvent | null => {
  const match = line.match(/^(\S+)\s+(INFO|WARN|ERROR|DEBUG)\s+(\S+)\s+(.+)$/);
  if (!match) return null;
  
  const [, timestamp, level, module, rest] = match;
  const dateObj = new Date(timestamp);
  
  const imoMatch = rest.match(/imo_no=(\d+)/);
  const vesselIdMatch = rest.match(/vessel_id=(\d+)/);
  const oldFlagMatch = rest.match(/old_flag="([^"]+)"/);
  const newFlagMatch = rest.match(/new_flag="([^"]+)"/);
  
  let action = 'Registry Operation';
  let entity = imoMatch ? `IMO: ${imoMatch[1]}` : vesselIdMatch ? `Vessel #${vesselIdMatch[1]}` : undefined;
  let message = '';
  let details = undefined;
  
  if (rest.includes('Boot')) {
    action = 'Service Start';
    entity = undefined;
    message = 'Vessel Registry started';
    details = rest.match(/version=([^\s]+)/)?.[0];
  } else if (rest.includes('Warmup')) {
    action = 'Cache Warmup';
    entity = undefined;
    message = 'Vessel cache warmed up';
    details = rest.match(/vessels_cached=(\d+).*ms=(\d+)/)?.[0];
  } else if (rest.includes('Lookup')) {
    action = 'Vessel Lookup';
    message = rest.includes('FOUND') ? 'Vessel found in registry' : 'Vessel not found';
    details = vesselIdMatch?.[0];
  } else if (rest.includes('UpdateFlag')) {
    action = 'Flag Update';
    message = 'Vessel flag updated';
    details = oldFlagMatch && newFlagMatch ? `${oldFlagMatch[1]} → ${newFlagMatch[1]}` : undefined;
  } else if (rest.includes('FlagStateChange')) {
    action = 'Flag Update Warning';
    message = 'Vessel flag updated with high frequency warning';
    details = rest.match(/last_change_minutes=(\d+)/)?.[0];
  } else if (module === 'http' || rest.includes('http')) {
    const httpMatch = rest.match(/(\d+)\s+(PATCH)/);
    action = httpMatch ? 'HTTP PATCH' : 'HTTP Request';
    message = 'Flag update completed';
    details = rest.match(/latency_ms=(\d+)/)?.[0];
  }
  
  // Catch-all for unmatched events
  if (!action) {
    action = module;
    message = rest.slice(0, 80);
    if (rest.length > 80) message += '...';
  }
  
  return {
    id: `${serviceName}-${index}`,
    timestamp,
    time: dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
    level: level as any,
    service: serviceName,
    module,
    action,
    entity,
    message,
    details
  };
};

const ServiceMonitor: React.FC<ServiceMonitorProps> = ({ serviceName, logData, icon, color }) => {
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<LogEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parse log file based on service type OR use static events for all services
  useEffect(() => {
    // Use static events from EventTimeline, filtered by service name
    let filteredEvents: LogEvent[] = [];

    if (serviceName.includes('API Event')) {
      // Filter events where module is 'api' (API events only, not EDI)
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.module === 'api');
    } else if (serviceName.includes('EDI')) {
      // Filter events where service is 'EDI Service'
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.service === 'EDI Service');
    } else if (serviceName.includes('Vessel Advice')) {
      // Filter events where service is 'Vessel Advice'
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.service === 'Vessel Advice');
    } else if (serviceName.includes('Container')) {
      // Filter events where service is 'Container Service'
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.service === 'Container Service');
    } else if (serviceName.includes('Vessel Registry')) {
      // Filter events where service is 'Vessel Registry'
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.service === 'Vessel Registry');
    } else if (serviceName.includes('Berth')) {
      // Filter events where service is 'Berth Application'
      filteredEvents = ALL_LOG_EVENTS.filter(event => event.service === 'Berth Application');
    }

    setEvents(filteredEvents);
    if (filteredEvents.length > 0) {
      setVisibleEvents([filteredEvents[0]]);
    }
  }, [logData, serviceName]);

  // Simulate real-time streaming
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % events.length;
        
        if (nextIndex === 0) {
          setVisibleEvents([events[0]]);
        } else {
          setVisibleEvents((prev) => [...prev, events[nextIndex]]);
        }
        
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [events]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleEvents]);

  const getEventStyle = (level: string) => {
    switch (level) {
      case 'ERROR':
        return { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-800/40' };
      case 'WARN':
        return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-800/40' };
      case 'DEBUG':
        return { icon: <Info className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-800/30', border: 'border-slate-700/40' };
      default:
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-800/40' };
    }
  };

  const recentEvents = visibleEvents.slice(-5);

  return (
    <>
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent pointer-events-none" />

        <div className="relative px-4 py-3 border-b border-cyan-900/30 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${color}`}>{icon}</div>
              <h3 className="text-sm font-bold text-slate-200">{serviceName}</h3>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-400">LIVE</span>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="relative h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent px-6 pt-6 pb-2">
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Waiting for events...
              </div>
            ) : (
              recentEvents.map((event, index) => {
                const style = getEventStyle(event.level);
                return (
                  <div
                    key={event.id}
                    className={`relative pl-8 pb-3 ml-2 ${index !== recentEvents.length - 1 ? 'border-l-2 border-slate-700/30' : ''}`}
                    style={{ animation: `fadeInUp 0.5s ease-out`, opacity: 0, animationFillMode: 'forwards' }}
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
                          <span className="text-xs text-slate-400 font-semibold">{event.service}</span>
                          <span className={`text-xs font-semibold uppercase ${style.color}`}>{event.level}</span>
                        </div>
                      </div>
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-cyan-400">{event.action}</span>
                        {event.entity && <span className="text-xs text-slate-400 ml-2">• {event.entity}</span>}
                      </div>
                      <p className="text-sm text-slate-200">{event.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="relative px-4 py-2 border-t border-cyan-900/30 bg-slate-950/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{visibleEvents.length} / {events.length} events</span>
            <div className="flex gap-3">
              <span className="text-red-400">{visibleEvents.filter(l => l.level === 'ERROR').length} errors</span>
              <span className="text-amber-400">{visibleEvents.filter(l => l.level === 'WARN').length} warnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal - Same format as EventTimeline */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={() => setSelectedEvent(null)}>
          <div className="bg-slate-900 border border-cyan-900/50 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-200">Event Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-200 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Timestamp</p>
                  <p className="text-sm font-mono text-slate-200">{selectedEvent.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <p className="text-xs text-slate-400">Service</p>
                  <p className="text-sm text-slate-200">{selectedEvent.service}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getEventStyle(selectedEvent.level).icon}
                <div>
                  <p className="text-xs text-slate-400">Log Level</p>
                  <p className={`text-sm font-semibold uppercase ${getEventStyle(selectedEvent.level).color}`}>{selectedEvent.level}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Action</p>
                <p className="text-sm font-semibold text-cyan-400">{selectedEvent.action}</p>
              </div>

              {selectedEvent.entity && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Entity</p>
                  <p className="text-sm text-slate-200">{selectedEvent.entity}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-1">Message</p>
                <p className="text-sm text-slate-200">{selectedEvent.message}</p>
              </div>

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

export default ServiceMonitor;
