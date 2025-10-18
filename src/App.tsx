import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  TrendingUp,
  Zap,
  Radio,
  Target,
  Shield
} from 'lucide-react';
import RealTimePanel from './components/RealTimePanel';
import HistoricalPanel from './components/HistoricalPanel';
import EventTimeline from './components/EventTimeline';
import SystemHealth from './components/SystemHealth';
import PatternRecognition from './components/PatternRecognition';
import FilterBar from './components/FilterBar';

function App() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [scanningActive, setScanningActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningActive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <header className="relative border-b border-cyan-900/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${scanningActive ? 'bg-cyan-400' : 'bg-cyan-600'} transition-colors duration-300`}>
                  <div className={`absolute inset-0 rounded-full ${scanningActive ? 'animate-ping bg-cyan-400' : ''}`} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Sentinel
                </h1>
                <p className="text-sm text-slate-400">AI-Powered Event Detection System</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/30 border border-cyan-800/40 rounded-lg">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-medium text-cyan-400">ACTIVE SCAN</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">System Nominal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        <FilterBar activeFilters={activeFilters} setActiveFilters={setActiveFilters} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SystemHealth />
          <EventTimeline />
          <PatternRecognition />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RealTimePanel activeFilters={activeFilters} />
          <HistoricalPanel activeFilters={activeFilters} />
        </div>
      </div>
    </div>
  );
}

export default App;
