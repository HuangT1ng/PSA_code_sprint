import React from 'react';
import { Filter, AlertTriangle, Anchor, FileText, Zap } from 'lucide-react';

interface FilterBarProps {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, setActiveFilters }) => {
  const filters = [
    { id: 'delays', label: 'Vessel Delays', icon: <Anchor className="w-4 h-4" /> },
    { id: 'edi', label: 'EDI Errors', icon: <FileText className="w-4 h-4" /> },
    { id: 'vessel', label: 'Vessel Events', icon: <Anchor className="w-4 h-4" /> },
    { id: 'critical', label: 'Critical Only', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters(
      activeFilters.includes(filterId)
        ? activeFilters.filter(f => f !== filterId)
        : [...activeFilters, filterId]
    );
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-300">Filters:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                activeFilters.includes(filter.id)
                  ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-lg shadow-cyan-900/30'
                  : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {filter.icon}
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>

        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="ml-auto text-sm text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
