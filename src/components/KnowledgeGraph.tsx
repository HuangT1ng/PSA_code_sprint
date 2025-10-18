import React, { useEffect, useRef, useState } from 'react';
import { XCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'module' | 'issue' | 'resolution' | 'system';
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
}

interface KnowledgeGraphProps {
  onClose?: () => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const animationFrameRef = useRef<number>();

  // Define knowledge graph structure with evenly spaced positions
  const nodes: Node[] = [
    // Core Modules (Center triangle - evenly spaced)
    { id: 'cntr', label: 'Container\n(CNTR)', type: 'module', x: 250, y: 250, vx: 0, vy: 0, color: '#10b981' },
    { id: 'vsl', label: 'Vessel\n(VSL)', type: 'module', x: 550, y: 250, vx: 0, vy: 0, color: '#3b82f6' },
    { id: 'edi', label: 'EDI/API\n(EA)', type: 'module', x: 400, y: 150, vx: 0, vy: 0, color: '#f59e0b' },

    // Container Issues (Left column - evenly distributed)
    { id: 'cntr-discrepancy', label: 'Data\nDiscrepancy', type: 'issue', x: 80, y: 120, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'cntr-auth', label: 'Auth\nRejection', type: 'issue', x: 80, y: 220, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'cntr-api-error', label: 'API\nTimeout', type: 'issue', x: 80, y: 320, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'cntr-duplicate', label: 'Duplicate\nEntry', type: 'issue', x: 80, y: 420, vx: 0, vy: 0, color: '#ef4444' },

    // Vessel Issues (Right column - evenly distributed)
    { id: 'vsl-eta-mismatch', label: 'ETA/ETB\nMismatch', type: 'issue', x: 720, y: 120, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'vsl-baplie', label: 'BAPLIE\nInconsistency', type: 'issue', x: 720, y: 220, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'vsl-api-error', label: 'Schedule\nAPI Error', type: 'issue', x: 720, y: 320, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'vsl-weather', label: 'Weather\nDelay', type: 'issue', x: 720, y: 420, vx: 0, vy: 0, color: '#ef4444' },

    // EDI/API Issues (Top row - evenly distributed)
    { id: 'edi-rate-limit', label: 'Rate\nLimiting', type: 'issue', x: 200, y: 40, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'edi-qualifier', label: 'Schema\nValidation', type: 'issue', x: 400, y: 40, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'edi-oauth', label: 'OAuth\nRejection', type: 'issue', x: 600, y: 40, vx: 0, vy: 0, color: '#ef4444' },
    { id: 'edi-timezone', label: 'Timezone\nDrift', type: 'issue', x: 300, y: 120, vx: 0, vy: 0, color: '#ef4444' },

    // Resolution Patterns (Corners and strategic positions - evenly distributed)
    { id: 'res-quarantine', label: 'EDI\nQuarantine', type: 'resolution', x: 200, y: 460, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-token-refresh', label: 'Token\nRefresh', type: 'resolution', x: 500, y: 40, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-dedup', label: 'De-duplication', type: 'resolution', x: 300, y: 460, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-cache-purge', label: 'Cache\nInvalidation', type: 'resolution', x: 500, y: 460, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-event-replay', label: 'Event\nReplay', type: 'resolution', x: 600, y: 460, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-reconcile', label: 'Cross-System\nReconcile', type: 'resolution', x: 500, y: 320, vx: 0, vy: 0, color: '#8b5cf6' },
    { id: 'res-retry', label: 'Retry\nPolicy', type: 'resolution', x: 300, y: 320, vx: 0, vy: 0, color: '#8b5cf6' },

    // Systems (Center - evenly spaced)
    { id: 'sys-tos', label: 'TOS', type: 'system', x: 350, y: 380, vx: 0, vy: 0, color: '#06b6d4' },
    { id: 'sys-portal', label: 'Customer\nPortal', type: 'system', x: 450, y: 380, vx: 0, vy: 0, color: '#06b6d4' },
  ];

  const edges: Edge[] = [
    // Container connections
    { source: 'cntr', target: 'cntr-discrepancy', label: 'has' },
    { source: 'cntr', target: 'cntr-api-error', label: 'has' },
    { source: 'cntr', target: 'cntr-auth', label: 'has' },
    { source: 'cntr', target: 'cntr-duplicate', label: 'has' },

    // Vessel connections
    { source: 'vsl', target: 'vsl-eta-mismatch', label: 'has' },
    { source: 'vsl', target: 'vsl-api-error', label: 'has' },
    { source: 'vsl', target: 'vsl-baplie', label: 'has' },
    { source: 'vsl', target: 'vsl-weather', label: 'has' },

    // EDI/API connections
    { source: 'edi', target: 'edi-oauth', label: 'has' },
    { source: 'edi', target: 'edi-qualifier', label: 'has' },
    { source: 'edi', target: 'edi-timezone', label: 'has' },
    { source: 'edi', target: 'edi-rate-limit', label: 'has' },

    // Cross-module connections
    { source: 'cntr', target: 'edi', label: 'uses' },
    { source: 'vsl', target: 'edi', label: 'uses' },
    { source: 'cntr', target: 'sys-tos', label: 'syncs' },
    { source: 'vsl', target: 'sys-tos', label: 'syncs' },
    { source: 'sys-portal', target: 'sys-tos', label: 'queries' },

    // Resolution connections
    { source: 'cntr-auth', target: 'res-token-refresh', label: 'fixed by' },
    { source: 'edi-oauth', target: 'res-token-refresh', label: 'fixed by' },
    { source: 'cntr-duplicate', target: 'res-dedup', label: 'fixed by' },
    { source: 'cntr-discrepancy', target: 'res-cache-purge', label: 'fixed by' },
    { source: 'cntr-discrepancy', target: 'res-event-replay', label: 'fixed by' },
    { source: 'vsl-eta-mismatch', target: 'res-reconcile', label: 'fixed by' },
    { source: 'vsl-baplie', target: 'res-event-replay', label: 'fixed by' },
    { source: 'edi-qualifier', target: 'res-quarantine', label: 'fixed by' },
    { source: 'cntr-api-error', target: 'res-retry', label: 'fixed by' },
    { source: 'vsl-api-error', target: 'res-retry', label: 'fixed by' },
    { source: 'edi-timezone', target: 'res-event-replay', label: 'fixed by' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // No physics simulation needed - using fixed positions
    // Render loop
    const render = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const radius = node.type === 'module' ? 35 : node.type === 'issue' ? 28 : 30;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected || isHovered ? node.color : node.color + 'cc';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#fff' : isHovered ? '#cbd5e1' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#fff';
        ctx.font = node.type === 'module' ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const lines = node.label.split('\n');
        lines.forEach((line, i) => {
          const yOffset = (i - (lines.length - 1) / 2) * 12;
          ctx.fillText(line, node.x, node.y + yOffset);
        });
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedNode = nodes.find(node => {
      const radius = node.type === 'module' ? 35 : node.type === 'issue' ? 28 : 30;
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return dist <= radius;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hoveredNode = nodes.find(node => {
      const radius = node.type === 'module' ? 35 : node.type === 'issue' ? 28 : 30;
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return dist <= radius;
    });

    setHoveredNode(hoveredNode || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  const getNodeDescription = (node: Node) => {
    const descriptions: Record<string, string> = {
      'cntr': 'Container module handles container lifecycle, tracking, and data management across systems.',
      'vsl': 'Vessel module manages vessel schedules, berthing, ETA/ETB, and operational planning.',
      'edi': 'EDI/API module handles electronic data interchange, API integrations, and message processing.',
      'cntr-discrepancy': 'Data mismatch between customer portal and TOS regarding container status or location.',
      'cntr-api-error': 'API timeouts and 500/504 errors when querying container endpoints.',
      'cntr-auth': 'Authentication token rejection due to clock skew or expired credentials.',
      'cntr-duplicate': 'Duplicate container entries with conflicting timestamps causing data regression.',
      'vsl-eta-mismatch': 'ETA/ETB discrepancies between berth plan and TOS due to tidal or operational constraints.',
      'vsl-api-error': 'Schedule API intermittent failures (401/403/500/502/504) affecting vessel data.',
      'vsl-baplie': 'BAPLIE inconsistency where discharge records conflict with stowage plan data.',
      'vsl-weather': 'Weather-related delays affecting vessel berthing and crane scheduling.',
      'edi-oauth': 'OAuth token rejection spikes causing 401/403 errors across services.',
      'edi-qualifier': 'Schema validation failures due to unexpected qualifiers in EDI segments.',
      'edi-timezone': 'Timezone drift causing eventTime serialization mismatches between systems.',
      'edi-rate-limit': 'Rate limiter throttling legitimate traffic during load surges.',
      'res-token-refresh': 'Rotate OAuth keys, refresh tokens, and verify NTP clock synchronization.',
      'res-dedup': 'De-duplicate messages using idempotency keys and control numbers.',
      'res-cache-purge': 'Force cache invalidation and rebuild hot keys to sync data.',
      'res-event-replay': 'Replay events from quarantine ordered by eventTime to correct sequence.',
      'res-reconcile': 'Cross-system reconciliation to align data between TOS, portal, and partners.',
      'res-quarantine': 'Quarantine problematic EDI messages and validate schema before reprocessing.',
      'res-retry': 'Implement exponential backoff, increase timeouts, and enable request coalescing.',
      'sys-tos': 'Terminal Operating System - authoritative source for operational data.',
      'sys-portal': 'Customer portal providing visibility into container and vessel information.',
    };
    return descriptions[node.id] || 'No description available.';
  };

  const content = (
    <div className="p-6 w-full">
      <div className="bg-slate-900 border border-cyan-900/50 rounded-xl p-6 w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">Knowledge Base Graph</h2>
            <p className="text-sm text-slate-400 mt-1">Interactive visualization of PSA system components and resolutions</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <canvas
              ref={canvasRef}
              className="w-full h-[500px] bg-slate-950/50 rounded-lg border border-slate-700/50"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
            />
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Module</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Issue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span>System</span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Node Information
            </h3>
            
            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: selectedNode.color }}
                    ></div>
                    <span className="text-lg font-semibold text-slate-200">
                      {selectedNode.label.replace('\n', ' ')}
                    </span>
                  </div>
                  <div className="inline-block px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 capitalize mb-3">
                    {selectedNode.type}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {getNodeDescription(selectedNode)}
                  </p>
                </div>

                {/* Connected nodes */}
                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Connected To:</p>
                  <div className="space-y-1">
                    {edges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .slice(0, 5)
                      .map((edge, i) => {
                        const connectedId = edge.source === selectedNode.id ? edge.target : edge.source;
                        const connectedNode = nodes.find(n => n.id === connectedId);
                        return connectedNode ? (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: connectedNode.color }}
                            ></div>
                            <span className="text-slate-400">
                              {connectedNode.label.replace('\n', ' ')}
                            </span>
                          </div>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Click on a node to view details
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Modules</div>
            <div className="text-xl font-bold text-green-400">
              {nodes.filter(n => n.type === 'module').length}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Issues</div>
            <div className="text-xl font-bold text-red-400">
              {nodes.filter(n => n.type === 'issue').length}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Resolutions</div>
            <div className="text-xl font-bold text-purple-400">
              {nodes.filter(n => n.type === 'resolution').length}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Connections</div>
            <div className="text-xl font-bold text-cyan-400">{edges.length}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // If onClose is provided, wrap in modal. Otherwise, return content directly.
  return onClose ? (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div 
        className="max-w-6xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  ) : content;
};

export default KnowledgeGraph;

