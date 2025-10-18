import React, { useState, useEffect } from 'react';
import { Activity, Target, Zap } from 'lucide-react';

interface HealthMetric {
  label: string;
  value: number;
  status: 'excellent' | 'good' | 'warning';
}

const SystemHealth: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { label: 'AI Confidence', value: 94, status: 'excellent' },
    { label: 'Detection Rate', value: 87, status: 'good' },
    { label: 'System Load', value: 34, status: 'excellent' },
  ]);

  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.min(100, Math.max(0, metric.value + (Math.random() - 0.5) * 8)),
        status: metric.value > 85 ? 'excellent' : metric.value > 70 ? 'good' : 'warning',
      })));
    }, 3000);

    const pulseInterval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-emerald-500 to-cyan-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      default: return 'from-amber-500 to-orange-500';
    }
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-200">System Health</h2>
        </div>
      </div>

      <div className="relative p-6 space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-800"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - metrics[0].value / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Target className={`w-8 h-8 mb-1 text-emerald-400 ${pulseActive ? 'animate-pulse' : ''}`} />
              <span className="text-2xl font-bold text-emerald-400">{Math.round(metrics[0].value)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">{metric.label}</span>
                <span className="text-sm font-bold text-slate-200">{Math.round(metric.value)}%</span>
              </div>
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getStatusColor(metric.status)} transition-all duration-1000 ease-out rounded-full`}
                  style={{ width: `${metric.value}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Scans/min</span>
            </div>
            <span className="text-xl font-bold text-slate-200">1,247</span>
          </div>
          <div className="p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Accuracy</span>
            </div>
            <span className="text-xl font-bold text-slate-200">98.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
