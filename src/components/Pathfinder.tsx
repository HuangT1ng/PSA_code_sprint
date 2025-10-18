import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Navigation, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Sparkles, 
  Activity, 
  GitBranch,
  PlayCircle,
  PauseCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Cpu,
  Database,
  RefreshCw,
  Trash2,
  Share2,
  BookOpen
} from 'lucide-react';

interface NovelIssue {
  id: string;
  name: string;
  tag: string;
  symptoms: string[];
}

interface CausalNode {
  id: string;
  name: string;
  status: 'checking' | 'suspicious' | 'clear' | 'root_cause';
  details: string;
}

interface MicroFix {
  id: string;
  action: string;
  type: 'restart' | 'flush' | 'reroute' | 'config';
  risk: 'low' | 'medium' | 'high';
  status: 'pending' | 'testing' | 'success' | 'failed';
}

interface AgentThought {
  id: string;
  text: string;
  type: 'analysis' | 'hypothesis' | 'action' | 'result';
}

const novelIssues: NovelIssue[] = [
  {
    id: 'novel1',
    name: 'EDI message REF-IFT-0007 stuck in ERROR status',
    tag: 'TCK-742311',
    symptoms: [
      'No acknowledgment sent to shipping line',
      'Message stuck in ERROR state for 45+ minutes',
      'EDI parser completed successfully',
      'No retry attempts being triggered',
      'Acknowledgment queue shows no pending items'
    ]
  },
  {
    id: 'novel2',
    name: 'Container Weight Discrepancy After EDI Import',
    tag: 'ALR-862445',
    symptoms: [
      'Container weight differs from EDI manifest',
      'Occurs only for containers in specific zones',
      'Weight recalculation gives different values',
      'No historical pattern found'
    ]
  }
];

const Pathfinder: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'detecting' | 'probing' | 'solving' | 'testing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentIssue, setCurrentIssue] = useState<NovelIssue>(novelIssues[0]);
  const [historyMatch, setHistoryMatch] = useState(false);
  const [causalNodes, setCausalNodes] = useState<CausalNode[]>([]);
  const [microFixes, setMicroFixes] = useState<MicroFix[]>([]);
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [playbookCreated, setPlaybookCreated] = useState(false);
  const [successfulFix, setSuccessfulFix] = useState<MicroFix | null>(null);
  
  const thoughtsRef = useRef<HTMLDivElement>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thoughtIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll thoughts
  useEffect(() => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
    }
  }, [agentThoughts]);

  const addThought = useCallback((text: string, type: AgentThought['type']) => {
    setAgentThoughts(prev => [...prev, {
      id: `thought-${Date.now()}-${Math.random()}`,
      text,
      type
    }]);
  }, []);

  const startSolving = useCallback((issueIndex: number) => {
    const issue = novelIssues[issueIndex];
    setCurrentIssue(issue);
    setIsActive(true);
    setCurrentPhase('detecting');
    setProgress(0);
    setHistoryMatch(false);
    setCausalNodes([]);
    setMicroFixes([]);
    setAgentThoughts([]);
    setPlaybookCreated(false);
    setSuccessfulFix(null);

    // Phase 1: Detecting (5 seconds)
    setTimeout(() => {
      addThought(`Analyzing incident: ${issue.tag}`, 'analysis');
      addThought('Searching historical incident database...', 'action');
    }, 500);

    setTimeout(() => {
      addThought('Scanned 2,847 past incidents - NO exact match found', 'result');
      addThought('Pattern similarity score: 34% (below threshold)', 'result');
      addThought('🔍 This is a NOVEL problem - activating exploratory mode', 'hypothesis');
      setHistoryMatch(false);
      setCurrentPhase('probing');
      setProgress(20);
    }, 3000);

    // Phase 2: Probing causal graph (8 seconds)
    setTimeout(() => {
      addThought('Building causal dependency graph...', 'action');
      addThought('Analyzing EDI message flow and acknowledgment chain', 'analysis');
      
      // Add causal nodes progressively
      const nodes: CausalNode[] = [
        { id: 'n1', name: 'EDI Parser', status: 'checking', details: 'Message parsing engine' },
        { id: 'n2', name: 'Message Queue', status: 'checking', details: 'RabbitMQ broker' },
        { id: 'n3', name: 'ACK Generator', status: 'checking', details: 'Acknowledgment service' },
        { id: 'n4', name: 'Outbound Gateway', status: 'checking', details: 'External EDI sender' },
        { id: 'n5', name: 'DB Transaction', status: 'checking', details: 'State persistence' },
      ];
      
      setCausalNodes(nodes);
    }, 5000);

    setTimeout(() => {
      addThought('Probing EDI Parser... ✓ Parsing completed successfully', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n1' ? { ...n, status: 'clear' } : n));
    }, 6000);

    setTimeout(() => {
      addThought('Probing Message Queue... ✓ Queue operational, no backlogs', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'clear' } : n));
    }, 7000);

    setTimeout(() => {
      addThought('Probing ACK Generator... ⚠ Service running but no activity', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n3' ? { ...n, status: 'suspicious' } : n));
    }, 8000);

    setTimeout(() => {
      addThought('Probing Outbound Gateway... ✓ Connection pool healthy', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n4' ? { ...n, status: 'clear' } : n));
    }, 9000);

    setTimeout(() => {
      addThought('Probing DB Transaction... 🎯 DEADLOCK DETECTED!', 'result');
      addThought('Transaction isolation level: SERIALIZABLE', 'analysis');
      addThought('Lock wait timeout: Message stuck in "processing" state', 'analysis');
      addThought('💡 Hypothesis: Orphaned DB lock preventing ACK generation', 'hypothesis');
      setCausalNodes(prev => prev.map(n => n.id === 'n5' ? { ...n, status: 'root_cause' } : n));
      setCurrentPhase('solving');
      setProgress(45);
    }, 11000);

    // Phase 3: Assembling micro-fixes (5 seconds)
    setTimeout(() => {
      addThought('Generating safe micro-fix strategies...', 'action');
      
      const fixes: MicroFix[] = [
        { id: 'fix1', action: 'Kill orphaned DB transaction and reset message state', type: 'flush', risk: 'low', status: 'pending' },
        { id: 'fix2', action: 'Lower transaction isolation to READ COMMITTED', type: 'config', risk: 'medium', status: 'pending' },
        { id: 'fix3', action: 'Reroute message to backup ACK processor', type: 'reroute', risk: 'low', status: 'pending' },
        { id: 'fix4', action: 'Restart EDI acknowledgment service', type: 'restart', risk: 'medium', status: 'pending' },
      ];
      
      setMicroFixes(fixes);
      addThought('Generated 4 potential fix strategies', 'result');
      addThought('Selecting lowest-risk option: Kill orphaned transaction', 'hypothesis');
    }, 13000);

    // Phase 4: Testing fixes (12 seconds)
    setTimeout(() => {
      setCurrentPhase('testing');
      setProgress(60);
      addThought('🧪 Testing Fix #1: Kill orphaned transaction & reset state', 'action');
      setMicroFixes(prev => prev.map(f => f.id === 'fix1' ? { ...f, status: 'testing' } : f));
    }, 15000);

    setTimeout(() => {
      addThought('Identifying transaction ID: tx-edi-4721...', 'action');
    }, 16000);

    setTimeout(() => {
      addThought('Transaction killed successfully', 'result');
      addThought('Resetting message REF-IFT-0007 to PENDING state...', 'action');
    }, 18000);

    setTimeout(() => {
      addThought('Message state reset complete', 'result');
      addThought('Triggering acknowledgment generation...', 'action');
    }, 20000);

    setTimeout(() => {
      addThought('✅ Acknowledgment generated and queued for delivery', 'result');
      addThought('EDI message status: ERROR → ACKNOWLEDGED', 'result');
      addThought('🎉 FIX SUCCESSFUL! Acknowledgment sent to shipping line', 'result');
      setMicroFixes(prev => prev.map(f => f.id === 'fix1' ? { ...f, status: 'success' } : f));
      setSuccessfulFix(fixes[0]);
      setProgress(85);
    }, 22000);

    // Phase 5: Creating playbook (4 seconds)
    setTimeout(() => {
      addThought('📖 Creating new playbook from successful resolution...', 'action');
      addThought('Documenting: symptoms, root cause, solution', 'analysis');
    }, 24000);

    setTimeout(() => {
      addThought('Playbook created: "EDI Orphaned Transaction Recovery"', 'result');
      addThought('Future similar issues can now use this playbook', 'result');
      setPlaybookCreated(true);
      setCurrentPhase('complete');
      setProgress(100);
      setIsActive(false);
    }, 26000);

    // Restart cycle after 15 seconds
    setTimeout(() => {
      const nextIndex = (issueIndex + 1) % novelIssues.length;
      startSolving(nextIndex);
    }, 41000);
  }, [addThought]);

  // Auto-start
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      startSolving(0);
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (thoughtIntervalRef.current) clearInterval(thoughtIntervalRef.current);
    };
  }, [startSolving]);

  const getPhaseIcon = (phase: typeof currentPhase) => {
    switch (phase) {
      case 'detecting': return Target;
      case 'probing': return GitBranch;
      case 'solving': return Lightbulb;
      case 'testing': return PlayCircle;
      case 'complete': return CheckCircle;
      default: return Brain;
    }
  };

  const PhaseIcon = getPhaseIcon(currentPhase);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Navigation className="w-8 h-8 text-emerald-400" />
            {isActive && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-200">Pathfinder++</h2>
            <p className="text-sm text-slate-400">AI Problem Solver for Novel Issues</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            {isActive ? 'SOLVING...' : currentPhase === 'complete' ? 'SOLVED' : 'READY'}
          </span>
        </div>
      </div>

      {/* Current Issue */}
      <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Novel Problem Detected</h3>
        <div className="bg-gradient-to-br from-red-950/40 to-orange-950/30 border-2 border-orange-600/60 rounded-lg p-4 shadow-lg shadow-orange-900/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-mono text-orange-400">
              {currentIssue.tag}
            </span>
            {!historyMatch && currentPhase !== 'idle' && (
              <span className="ml-auto flex items-center gap-1 text-xs px-2 py-1 bg-red-900/40 border border-red-700/40 rounded text-red-300">
                <XCircle className="w-3 h-3" />
                No Historical Match
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-200 mb-3">{currentIssue.name}</p>
          
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold mb-1">Symptoms:</p>
            {currentIssue.symptoms.map((symptom, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-orange-400 mt-0.5">•</span>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      {currentPhase !== 'idle' && (
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-200">AI Agent Progress</h3>
            <span className="text-2xl font-bold text-emerald-400">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-cyan-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="flex items-center justify-between mt-6">
            {(['detecting', 'probing', 'solving', 'testing', 'complete'] as const).map((phase, idx) => {
              const Icon = getPhaseIcon(phase);
              const isActive = currentPhase === phase;
              const isPast = ['detecting', 'probing', 'solving', 'testing', 'complete'].indexOf(currentPhase) > idx;
              
              return (
                <React.Fragment key={phase}>
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-600 shadow-lg shadow-emerald-600/50 animate-pulse' 
                        : isPast 
                        ? 'bg-emerald-700/50' 
                        : 'bg-slate-800/50'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isActive || isPast ? 'text-white' : 'text-slate-500'
                      }`} />
                    </div>
                    <span className={`text-xs font-medium capitalize ${
                      isActive ? 'text-emerald-400' : isPast ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {phase}
                    </span>
                  </div>
                  {idx < 4 && (
                    <div className={`flex-1 h-1 rounded transition-all duration-300 ${
                      isPast ? 'bg-emerald-700/50' : 'bg-slate-800/50'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* AI Thought Process */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h4 className="text-sm font-semibold text-slate-200">AI Agent Thinking Process</h4>
            </div>
            <div 
              ref={thoughtsRef}
              className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50"
            >
              <div className="space-y-2 font-mono text-xs">
                {agentThoughts.map((thought, idx) => {
                  const icons = {
                    analysis: <Cpu className="w-3 h-3 text-cyan-400" />,
                    hypothesis: <Lightbulb className="w-3 h-3 text-yellow-400" />,
                    action: <Activity className="w-3 h-3 text-emerald-400" />,
                    result: <CheckCircle className="w-3 h-3 text-emerald-400" />
                  };
                  
                  return (
                    <div 
                      key={thought.id}
                      className="flex items-start gap-2 text-slate-300 animate-fadeIn"
                    >
                      {icons[thought.type]}
                      <span className="text-emerald-400">›</span>
                      <span className="flex-1">{thought.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Causal Graph */}
      {causalNodes.length > 0 && (
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-slate-200">Causal Dependency Graph</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {causalNodes.map((node) => {
              const statusConfig = {
                checking: { bg: 'bg-slate-800/40', border: 'border-slate-600/40', text: 'text-slate-400', icon: Activity },
                clear: { bg: 'bg-emerald-950/30', border: 'border-emerald-800/40', text: 'text-emerald-400', icon: CheckCircle },
                suspicious: { bg: 'bg-yellow-950/30', border: 'border-yellow-800/40', text: 'text-yellow-400', icon: AlertCircle },
                root_cause: { bg: 'bg-red-950/40', border: 'border-red-600/60', text: 'text-red-400', icon: Target }
              };
              
              const config = statusConfig[node.status];
              const StatusIcon = config.icon;
              
              return (
                <div 
                  key={node.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${config.bg} ${config.border} ${
                    node.status === 'checking' ? 'animate-pulse' : ''
                  } ${node.status === 'root_cause' ? 'shadow-lg shadow-red-900/30 scale-105' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StatusIcon className={`w-4 h-4 ${config.text} ${node.status === 'checking' ? 'animate-spin' : ''}`} />
                    <span className={`text-xs font-semibold ${config.text}`}>{node.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{node.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Micro-Fixes */}
      {microFixes.length > 0 && (
        <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-slate-200">Micro-Fix Strategies</h3>
          </div>
          <div className="space-y-3">
            {microFixes.map((fix) => {
              const typeIcons = {
                restart: RefreshCw,
                flush: Trash2,
                reroute: Share2,
                config: Database
              };
              
              const riskColors = {
                low: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40',
                medium: 'text-yellow-400 bg-yellow-950/30 border-yellow-800/40',
                high: 'text-red-400 bg-red-950/30 border-red-800/40'
              };
              
              const statusConfig = {
                pending: { bg: 'bg-slate-800/30', border: 'border-slate-700/40', text: 'text-slate-400' },
                testing: { bg: 'bg-cyan-950/40', border: 'border-cyan-600/60', text: 'text-cyan-400' },
                success: { bg: 'bg-emerald-950/40', border: 'border-emerald-600/60', text: 'text-emerald-400' },
                failed: { bg: 'bg-red-950/40', border: 'border-red-600/60', text: 'text-red-400' }
              };
              
              const TypeIcon = typeIcons[fix.type];
              const config = statusConfig[fix.status];
              
              return (
                <div 
                  key={fix.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${config.bg} ${config.border} ${
                    fix.status === 'testing' ? 'animate-pulse shadow-lg shadow-cyan-900/30' : ''
                  } ${fix.status === 'success' ? 'shadow-lg shadow-emerald-900/30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className={`w-5 h-5 ${config.text} ${fix.status === 'testing' ? 'animate-spin' : ''}`} />
                      <div>
                        <p className={`text-sm font-semibold ${config.text}`}>{fix.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded border ${riskColors[fix.risk]}`}>
                            {fix.risk} risk
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${config.text}`}>
                            {fix.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {fix.status === 'success' && (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Playbook Created */}
      {playbookCreated && currentPhase === 'complete' && (
        <div className="bg-gradient-to-br from-emerald-950/40 to-cyan-950/30 border-2 border-emerald-600/60 rounded-xl p-6 shadow-lg shadow-emerald-900/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-slate-200">New Playbook Created!</h4>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-slate-300 mb-4">
                Successfully solved a novel problem and documented the solution. This playbook is now available for future similar issues.
              </p>
              
              <div className="bg-slate-950/50 border border-slate-700/40 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-xs text-slate-400">Playbook Name:</span>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">EDI Orphaned Transaction Recovery</p>
                </div>
                
                <div>
                  <span className="text-xs text-slate-400">Root Cause:</span>
                  <p className="text-sm text-slate-200 mt-1">Orphaned database transaction lock preventing acknowledgment service from processing message REF-IFT-0007</p>
                </div>
                
                <div>
                  <span className="text-xs text-slate-400">Solution:</span>
                  <p className="text-sm text-slate-200 mt-1">{successfulFix?.action}</p>
                </div>
                
                <div className="flex items-center gap-4 pt-2 border-t border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Success Rate: 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-400">Resolution Time: 26s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-400">Risk: Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathfinder;

