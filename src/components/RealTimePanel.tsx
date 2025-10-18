import React, { useState, useEffect } from 'react';
import { Radio, Zap, AlertTriangle, Info, XCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  source: string;
  detected: boolean;
}

interface RealTimePanelProps {
  activeFilters: string[];
}

const RealTimePanel: React.FC<RealTimePanelProps> = ({ activeFilters }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const generateLog = (): LogEntry => {
      const severities: Array<'info' | 'warning' | 'critical'> = ['info', 'info', 'info', 'warning', 'critical'];
      const sources = ['EDI Gateway', 'Vessel Tracker', 'Port System', 'Customs Bridge', 'Cargo Monitor'];
      const messages = {
        info: [
          'Container CSNU1234567 processed successfully',
          'Vessel ETA updated: 14:30 UTC',
          'EDI transmission completed',
          'Port clearance granted for manifest #M8829',
        ],
        warning: [
          'Vessel delay detected: 2.5 hours behind schedule',
          'EDI parsing error: Invalid BOL format',
          'Duplicate manifest entry detected',
          'Port congestion alert: 15% above threshold',
        ],
        critical: [
          'EDI transmission failure: Connection timeout',
          'Vessel route deviation: 45km off course',
          'Critical delay: 8+ hours behind schedule',
          'System authentication failure detected',
        ],
      };

      const severity = severities[Math.floor(Math.random() * severities.length)];
      const messageList = messages[severity];

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: messageList[Math.floor(Math.random() * messageList.length)],
        severity,
        source: sources[Math.floor(Math.random() * sources.length)],
        detected: severity !== 'info' && Math.random() > 0.3,
      };
    };

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = generateLog();
        return [newLog, ...prev].slice(0, 12);
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const filteredLogs = activeFilters.length > 0
    ? logs.filter(log => {
        if (activeFilters.includes('delays') && log.message.toLowerCase().includes('delay')) return true;
        if (activeFilters.includes('edi') && log.message.toLowerCase().includes('edi')) return true;
        if (activeFilters.includes('vessel') && log.message.toLowerCase().includes('vessel')) return true;
        if (activeFilters.includes('critical') && log.severity === 'critical') return true;
        return false;
      })
    : logs;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-950/30 border-red-800/40';
      case 'warning': return 'text-amber-400 bg-amber-950/30 border-amber-800/40';
      default: return 'text-slate-400 bg-slate-800/30 border-slate-700/40';
    }
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-bold text-cyan-400">Real-Time Monitor</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-lg">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">LIVE</span>
          </div>
        </div>

        <div className="relative h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
            style={{ width: `${scanProgress}%` }}
          />
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      <div className="relative h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent">
        <div className="p-4 space-y-2">
          {filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className={`relative p-3 border rounded-lg transition-all duration-300 ${getSeverityColor(log.severity)} ${
                log.detected ? 'ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20' : ''
              }`}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              {log.detected && (
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full">
                  <div className="absolute inset-0 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${log.severity === 'critical' ? 'text-red-400' : log.severity === 'warning' ? 'text-amber-400' : 'text-slate-500'}`}>
                  {getSeverityIcon(log.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-800/50 border border-slate-700/50 rounded text-slate-400">
                      {log.source}
                    </span>
                    {log.detected && (
                      <span className="text-xs px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/40 rounded text-cyan-400 font-medium animate-pulse">
                        ANOMALY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200">{log.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimePanel;
