import React from 'react';
import { Filter, Package, Anchor, FileText, MoreHorizontal, BookOpen } from 'lucide-react';

interface FilterBarProps {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  onOpenKnowledgeGraph: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, setActiveFilters, onOpenKnowledgeGraph }) => {
  const filters = [
    { id: 'cntr', label: 'Container (CNTR)', icon: <Package className="w-4 h-4" /> },
    { id: 'vs', label: 'Vessel (VS)', icon: <Anchor className="w-4 h-4" /> },
    { id: 'ea', label: 'EDI/API (EA)', icon: <FileText className="w-4 h-4" /> },
    { id: 'others', label: 'Others', icon: <MoreHorizontal className="w-4 h-4" /> },
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

        <div className="ml-auto flex items-center gap-3">
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="text-sm text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              Clear all
            </button>
          )}
          
          <button
            onClick={onOpenKnowledgeGraph}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-800/50 border-slate-700/40 text-slate-300 hover:border-cyan-600/60 hover:text-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
