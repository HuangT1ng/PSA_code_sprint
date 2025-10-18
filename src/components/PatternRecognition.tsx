import React, { useState, useEffect } from 'react';
import { Target, TrendingUp } from 'lucide-react';

interface PatternNode {
  id: string;
  x: number;
  y: number;
  size: number;
  intensity: number;
}

const PatternRecognition: React.FC = () => {
  const [nodes, setNodes] = useState<PatternNode[]>([]);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const generateNodes = () => {
      return Array(12).fill(0).map((_, i) => ({
        id: `node-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        intensity: Math.random(),
      }));
    };

    setNodes(generateNodes());

    const nodesInterval = setInterval(() => {
      setNodes(generateNodes());
    }, 5000);

    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => {
      clearInterval(nodesInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/10 to-transparent pointer-events-none" />

      <div className="relative px-6 py-4 border-b border-cyan-900/30 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-bold text-slate-200">Pattern Recognition</h2>
        </div>
      </div>

      <div className="relative p-6">
        <div className="relative h-[220px] bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 70%)' }} />

          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
            style={{ top: `${scanLine}%`, opacity: 0.8, boxShadow: '0 0 20px rgba(167, 139, 250, 0.6)' }}
          />

          <svg className="w-full h-full">
            {nodes.map((node, i) => (
              <g key={node.id}>
                {nodes.slice(i + 1).map(targetNode => {
                  if (Math.abs(node.x - targetNode.x) < 30 && Math.abs(node.y - targetNode.y) < 30) {
                    return (
                      <line
                        key={`${node.id}-${targetNode.id}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke="rgba(139, 92, 246, 0.3)"
                        strokeWidth="1"
                        className="animate-pulse"
                      />
                    );
                  }
                  return null;
                })}

                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={node.size / 2}
                  fill={`rgba(139, 92, 246, ${node.intensity * 0.6})`}
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={node.size / 3}
                  fill="rgba(167, 139, 250, 0.9)"
                />
              </g>
            ))}
          </svg>

          <div className="absolute top-2 right-2 px-2 py-1 bg-violet-950/40 border border-violet-800/40 rounded text-xs font-mono text-violet-400">
            ANALYZING
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg text-center">
            <div className="text-xs text-slate-400 mb-1">Clusters</div>
            <div className="text-lg font-bold text-violet-400">{nodes.length}</div>
          </div>
          <div className="p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg text-center">
            <div className="text-xs text-slate-400 mb-1">Patterns</div>
            <div className="text-lg font-bold text-violet-400">8</div>
          </div>
          <div className="p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg text-center">
            <div className="text-xs text-slate-400 mb-1">Correlation</div>
            <div className="text-lg font-bold text-violet-400">94%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognition;
