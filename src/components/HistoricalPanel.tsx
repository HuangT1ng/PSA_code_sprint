import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, Activity } from 'lucide-react';

interface TicketCluster {
  id: string;
  pattern: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  severity: 'low' | 'medium' | 'high';
  lastOccurrence: string;
  growth: number;
}

interface HistoricalPanelProps {
  activeFilters: string[];
}

const HistoricalPanel: React.FC<HistoricalPanelProps> = ({ activeFilters }) => {
  const [clusters, setClusters] = useState<TicketCluster[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  useEffect(() => {
    const patterns = [
      'EDI transmission timeouts',
      'Vessel delay notifications',
      'Container tracking sync failures',
      'Port system authentication errors',
      'Manifest data mismatches',
      'Customs clearance delays',
    ];

    const generateClusters = () => {
      return patterns.map((pattern, i) => ({
        id: `cluster-${i}`,
        pattern,
        count: Math.floor(Math.random() * 150) + 10,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        lastOccurrence: `${Math.floor(Math.random() * 24)}h ago`,
        growth: Math.floor(Math.random() * 60) - 20,
      }));
    };

    const generateHeatmap = () => {
      return Array(7).fill(0).map(() =>
        Array(24).fill(0).map(() => Math.random())
      );
    };

    setClusters(generateClusters());
    setHeatmapData(generateHeatmap());

    const interval = setInterval(() => {
      setClusters(generateClusters());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-amber-500 to-amber-600';
      default: return 'from-emerald-500 to-emerald-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-blue-400">Historical Analysis</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-800/40 rounded-lg">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">30 DAY SCAN</span>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900/50 scrollbar-track-transparent">
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Recurring Patterns</h3>
            </div>
            <div className="space-y-3">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="relative p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg hover:border-blue-700/60 transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b rounded-l-lg opacity-80"
                       style={{
                         background: `linear-gradient(to bottom, ${cluster.severity === 'high' ? '#ef4444' : cluster.severity === 'medium' ? '#f59e0b' : '#10b981'}, transparent)`
                       }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 mb-2">{cluster.pattern}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          {cluster.count} incidents
                        </span>
                        <span>Last: {cluster.lastOccurrence}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-lg font-bold ${cluster.growth > 0 ? 'text-red-400' : cluster.growth < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {getTrendIcon(cluster.trend)} {Math.abs(cluster.growth)}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        cluster.severity === 'high' ? 'bg-red-950/30 border-red-800/40 text-red-400' :
                        cluster.severity === 'medium' ? 'bg-amber-950/30 border-amber-800/40 text-amber-400' :
                        'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                      }`}>
                        {cluster.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 h-12 flex items-end gap-0.5">
                    {Array(30).fill(0).map((_, i) => {
                      const height = Math.random() * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-t transition-all duration-300 group-hover:from-blue-400 group-hover:to-blue-300"
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Activity Heatmap</h3>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
              <div className="space-y-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-8">{day}</span>
                    <div className="flex-1 flex gap-1">
                      {heatmapData[dayIndex]?.map((intensity, hourIndex) => (
                        <div
                          key={hourIndex}
                          className="flex-1 h-4 rounded-sm transition-all duration-300 hover:scale-110"
                          style={{
                            backgroundColor: `rgba(34, 211, 238, ${intensity * 0.8})`,
                          }}
                          title={`${day} ${hourIndex}:00 - Activity: ${Math.floor(intensity * 100)}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPanel;
