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
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
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
    name: 'Duplicate Container CMAU0000020 in PORTNET',
    tag: 'ALR-861600',
    symptoms: [
      'Customer seeing 2 identical container records in PORTNET',
      'Both records show status=DISCHARGED',
      'Events generated within 45 second window',
      'Deduplication logic failed to suppress duplicate',
      'Correlation ID corr-cont-0001 on both events'
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
  const [_progress, setProgress] = useState(0);
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
      addThought('This is a NOVEL problem - activating exploratory mode', 'hypothesis');
      setHistoryMatch(false);
      setCurrentPhase('probing');
      setProgress(20);
    }, 3000);

    // Phase 2: Probing causal graph (8 seconds)
    setTimeout(() => {
      addThought('Building causal dependency graph...', 'action');
      addThought('Analyzing container event flow and deduplication chain', 'analysis');
      
      // Add causal nodes progressively
      const nodes: CausalNode[] = [
        { id: 'n1', name: 'Container Service', status: 'checking', details: 'Container snapshot engine' },
        { id: 'n2', name: 'Message Queue', status: 'checking', details: 'RabbitMQ broker' },
        { id: 'n3', name: 'Deduplication Filter', status: 'checking', details: 'Event dedup logic' },
        { id: 'n4', name: 'PORTNET Gateway', status: 'checking', details: 'Customer portal sync' },
        { id: 'n5', name: 'Idempotency Check', status: 'checking', details: 'Hash validation' },
      ];
      
      setCausalNodes(nodes);
    }, 5000);

    setTimeout(() => {
      addThought('Probing Container Service... Snapshot generation working', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n1' ? { ...n, status: 'clear' } : n));
    }, 6000);

    setTimeout(() => {
      addThought('Probing Message Queue... Two events detected within 45s window', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n2' ? { ...n, status: 'suspicious' } : n));
    }, 7000);

    setTimeout(() => {
      addThought('Probing Deduplication Filter... 60s window configured correctly', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n3' ? { ...n, status: 'clear' } : n));
    }, 8000);

    setTimeout(() => {
      addThought('Probing PORTNET Gateway... Both events consumed successfully', 'result');
      setCausalNodes(prev => prev.map(n => n.id === 'n4' ? { ...n, status: 'clear' } : n));
    }, 9000);

    setTimeout(() => {
      addThought('Probing Idempotency Check... VALIDATION BYPASS DETECTED!', 'result');
      addThought('Correlation ID corr-cont-0001 on both events', 'analysis');
      addThought('Message content hash not being validated properly', 'analysis');
      addThought('Hypothesis: Idempotency key check failing for identical payloads', 'hypothesis');
      setCausalNodes(prev => prev.map(n => n.id === 'n5' ? { ...n, status: 'root_cause' } : n));
      setCurrentPhase('solving');
      setProgress(45);
    }, 11000);

    // Phase 3: Assembling micro-fixes (5 seconds)
    setTimeout(() => {
      addThought('Generating safe micro-fix strategies...', 'action');
      
      const fixes: MicroFix[] = [
        { id: 'fix1', action: 'Purge duplicate event from PORTNET and enable strict hash validation', type: 'flush', risk: 'low', status: 'pending' },
        { id: 'fix2', action: 'Adjust deduplication window to 90 seconds with stricter rules', type: 'config', risk: 'medium', status: 'pending' },
        { id: 'fix3', action: 'Implement content-based idempotency key generation', type: 'config', risk: 'low', status: 'pending' },
        { id: 'fix4', action: 'Restart Container Service with enhanced validation', type: 'restart', risk: 'medium', status: 'pending' },
      ];
      
      setMicroFixes(fixes);
      addThought('Generated 4 potential fix strategies', 'result');
      addThought('Selecting lowest-risk option: Purge duplicate and enable validation', 'hypothesis');
    }, 13000);

    // Phase 4: Testing fixes (12 seconds)
    setTimeout(() => {
      setCurrentPhase('testing');
      setProgress(60);
      addThought('Testing Fix #1: Purge duplicate & enable validation', 'action');
      setMicroFixes(prev => prev.map(f => f.id === 'fix1' ? { ...f, status: 'testing' } : f));
    }, 15000);

    setTimeout(() => {
      addThought('Identifying duplicate record: CMAU0000020 in PORTNET...', 'action');
    }, 16000);

    setTimeout(() => {
      addThought('Duplicate record purged successfully', 'result');
      addThought('Enabling strict content hash validation in deduplication filter...', 'action');
    }, 18000);

    setTimeout(() => {
      addThought('Validation rules updated', 'result');
      addThought('Testing with new container event to verify deduplication...', 'action');
    }, 20000);

    setTimeout(() => {
      addThought('Duplicate event correctly suppressed', 'result');
      addThought('Container CMAU0000020: PORTNET shows single record', 'result');
      addThought('FIX SUCCESSFUL! Deduplication logic working correctly', 'result');
      setMicroFixes(prev => {
        const updated = prev.map(f => f.id === 'fix1' ? { ...f, status: 'success' as const } : f);
        setSuccessfulFix(updated[0]);
        return updated;
      });
      setProgress(85);
    }, 22000);

    // Phase 5: Creating playbook (4 seconds)
    setTimeout(() => {
      addThought('Creating new playbook from successful resolution...', 'action');
      addThought('Documenting: symptoms, root cause, solution', 'analysis');
    }, 24000);

    setTimeout(() => {
      addThought('Playbook created: "Container Event Deduplication Recovery"', 'result');
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Navigation className="w-8 h-8 text-white" />
            {isActive && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pathfinder++</h2>
            <p className="text-sm text-white/60">AI Problem Solver for Novel Issues</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            {isActive ? 'SOLVING...' : currentPhase === 'complete' ? 'SOLVED' : 'READY'}
          </span>
        </div>
      </div>

      {/* Current Issue */}
      <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Novel Problem Detected</h3>
        <div className="bg-black/40 backdrop-blur-sm border-2 border-orange-500/40 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-mono text-orange-400">
              {currentIssue.tag}
            </span>
            {!historyMatch && currentPhase !== 'idle' && (
              <span className="ml-auto flex items-center gap-1 text-xs px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-400">
                <XCircle className="w-3 h-3" />
                No Historical Match
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white mb-3">{currentIssue.name}</p>
          
          <div className="space-y-1">
            <p className="text-xs text-white/60 font-semibold mb-1">Symptoms:</p>
            {currentIssue.symptoms.map((symptom, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                <span className="text-orange-400 mt-0.5">•</span>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      {currentPhase !== 'idle' && (
        <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>

          {/* Phase Indicators */}
          <div className="flex items-center justify-between mt-6">
            {(['detecting', 'probing', 'solving', 'testing', 'complete'] as const).map((phase, _idx) => {
              const Icon = getPhaseIcon(phase);
              const isActive = currentPhase === phase;
              const isPast = ['detecting', 'probing', 'solving', 'testing', 'complete'].indexOf(currentPhase) > _idx;
              
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
                        : 'bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isActive || isPast ? 'text-white' : 'text-white/40'
                      }`} />
                    </div>
                    <span className={`text-xs font-medium capitalize ${
                      isActive ? 'text-emerald-400' : isPast ? 'text-emerald-600' : 'text-white/40'
                    }`}>
                      {phase}
                    </span>
                  </div>
                  {_idx < 4 && (
                    <div className={`flex-1 h-1 rounded transition-all duration-300 ${
                      isPast ? 'bg-emerald-700/50' : 'bg-white/10'
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
              <h4 className="text-sm font-semibold text-white">AI Agent Thinking Process</h4>
            </div>
            <div 
              ref={thoughtsRef}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
            >
              <div className="space-y-2 font-mono text-xs">
                {agentThoughts.map((thought) => {
                  return (
                    <div 
                      key={thought.id}
                      className="flex items-start gap-2 text-white/60 animate-fadeIn"
                    >
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
        <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Causal Dependency Graph</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {causalNodes.map((node) => {
              const statusConfig = {
                checking: { bg: 'bg-black/40 backdrop-blur-sm', border: 'border-white/20', text: 'text-white/60', icon: Activity },
                clear: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: CheckCircle },
                suspicious: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: AlertCircle },
                root_cause: { bg: 'bg-red-500/20', border: 'border-red-500/60', text: 'text-red-400', icon: Target }
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
                  <p className="text-xs text-white/60">{node.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Micro-Fixes */}
      {microFixes.length > 0 && (
        <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Micro-Fix Strategies</h3>
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
                low: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
                medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40',
                high: 'text-red-400 bg-red-500/20 border-red-500/40'
              };
              
              const statusConfig = {
                pending: { bg: 'bg-black/40 backdrop-blur-sm', border: 'border-white/10', text: 'text-white/60' },
                testing: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/60', text: 'text-cyan-400' },
                success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/60', text: 'text-emerald-400' },
                failed: { bg: 'bg-red-500/20', border: 'border-red-500/60', text: 'text-red-400' }
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
        <div className="bg-black/40 backdrop-blur-sm border-2 border-emerald-500/60 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-white">New Playbook Created!</h4>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-white/80 mb-4">
                Successfully solved a novel problem and documented the solution. This playbook is now available for future similar issues.
              </p>
              
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-xs text-white/60">Playbook Name:</span>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">Container Event Deduplication Recovery</p>
                </div>
                
                <div>
                  <span className="text-xs text-white/60">Root Cause:</span>
                  <p className="text-sm text-white/80 mt-1">Idempotency key validation bypass causing duplicate container CMAU0000020 events to reach PORTNET within 45s window</p>
                </div>
                
                <div>
                  <span className="text-xs text-white/60">Solution:</span>
                  <p className="text-sm text-white/80 mt-1">{successfulFix?.action}</p>
                </div>
                
                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-white/60">Success Rate: 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white/60">Resolution Time: 26s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white/60">Risk: Low</span>
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

