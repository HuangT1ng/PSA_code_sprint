import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, 
  CheckCircle, 
  Activity,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkles,
  CheckSquare
} from 'lucide-react';

interface AgentMessage {
  id: string;
  agent: 'planner' | 'strategist' | 'system';
  type: 'thinking' | 'proposal' | 'critique' | 'agreement' | 'system' | 'clear';
  content: string;
  timestamp: number;
  round: number;
  status: 'pending' | 'active' | 'completed';
  isTyping?: boolean;
  todo?: {
    title: string;
    description: string;
    stepNumber: number;
  };
  metadata?: {
    confidence?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    timeToRecover?: string;
    blastRadius?: string;
  };
}

interface AgentCollaborationProps {}

// Typewriter component for word-by-word loading
const TypewriterText: React.FC<{ 
  text: string; 
  onComplete?: () => void;
  isActive?: boolean;
}> = ({ text, onComplete, isActive = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setHasCompleted(false);
  }, [text]);

  useEffect(() => {
    if (!isActive || hasCompleted) return;
    
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // 30ms delay between characters
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete && !hasCompleted) {
      setHasCompleted(true);
      // Message is complete, notify parent
      setTimeout(() => {
        onComplete();
      }, 500); // Small delay after completion
    }
  }, [currentIndex, text, isActive, onComplete, hasCompleted]);

  return (
    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </pre>
  );
};

// Define messages outside component to avoid recreation
const agentMessages: AgentMessage[] = [
    // Round 1 - Planner
    {
      id: 'p1-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Understanding the Problem\n\n"EDI translator is missing a segment. This is blocking container timeline processing. Need to assess impact and SLA constraints."',
      timestamp: 0,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Understand the Problem',
        description: 'Analyze EDI translator issue, assess impact, identify SLA constraints',
        stepNumber: 1
      }
    },
    {
      id: 'p1-2',
      agent: 'planner',
      type: 'thinking',
      content: '🧭 Step 2 — Exploring Solution Paths\n\n"Generated three options:\n• Option A: Auto-fix missing segment + reroute\n• Option B: Wait for manual intervention\n• Option C: Manual fix with backup route"',
      timestamp: 2,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Explore Solution Paths',
        description: 'Generate multiple solution options with pros/cons analysis',
        stepNumber: 2
      }
    },
    {
      id: 'p1-3',
      agent: 'planner',
      type: 'proposal',
      content: '🧩 Step 3 — Initial Plan Proposal\n\n"Proposing Plan A: Auto-fix with backup route and monitoring.\n• Detect missing segment\n• Auto-generate replacement\n• Reroute through backup\n• Monitor success rate"',
      timestamp: 4,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Form Initial Plan',
        description: 'Propose auto-fix solution with backup route and monitoring',
        stepNumber: 3
      },
      metadata: {
        confidence: 75,
        riskLevel: 'medium',
        timeToRecover: '2-3 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 1 - Strategist
    {
      id: 's1-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Evaluating Each Candidate\n\n"Scoring options:\n• Plan A: Fast (2-3min) but moderate risk\n• Plan B: Fails SLA (too slow)\n• Plan C: Too slow, manual overhead"',
      timestamp: 6,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Evaluate Each Candidate',
        description: 'Score all solution options based on speed, risk, and feasibility',
        stepNumber: 1
      }
    },
    {
      id: 's1-2',
      agent: 'strategist',
      type: 'critique',
      content: '📊 Step 2 — Identifying Weaknesses\n\n"Plan A has gaps:\n• No canary rollout protection\n• No abort conditions if errors spike\n• No capacity validation for backup route"',
      timestamp: 8,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Identify Weaknesses',
        description: 'Find potential failure points and missing safeguards',
        stepNumber: 2
      }
    },
    {
      id: 's1-3',
      agent: 'strategist',
      type: 'critique',
      content: '⚔️ Step 3 — Recommending Improvements\n\n"Add safety measures:\n• Canary ingestion ramping 10% every minute\n• Auto-rollback if error rate exceeds 1%\n• Alert hooks before reroute"',
      timestamp: 10,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Recommend Improvements',
        description: 'Suggest specific safety measures and safeguards',
        stepNumber: 3
      }
    },


    // Round 2 - Planner
    {
      id: 'p2-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Absorbing Feedback\n\n"Strategist wants safety measures. Good call. Need to integrate canary rollout, rollback conditions, and observability."',
      timestamp: 14,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Absorb Feedback',
        description: 'Accept and integrate strategist safety recommendations',
        stepNumber: 1
      }
    },
    {
      id: 'p2-2',
      agent: 'planner',
      type: 'proposal',
      content: '🧭 Step 2 — Integrating Changes\n\n"Modify Plan A to include:\n• Canary ingestion ramping 10% every minute\n• Auto-rollback if error rate exceeds 1%\n• Alert hook before reroute"',
      timestamp: 16,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Integrate Changes',
        description: 'Modify plan with canary rollout, rollback, and alerts',
        stepNumber: 2
      }
    },
    {
      id: 'p2-3',
      agent: 'planner',
      type: 'proposal',
      content: '🧩 Step 3 — Refined Plan\n\n"Refined Plan A_v2: auto-fix with progressive rollout and abort safeguards.\n• Progressive canary deployment\n• Real-time error monitoring\n• Automatic rollback triggers"',
      timestamp: 18,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Propose Refined Plan',
        description: 'Present Plan A_v2 with progressive rollout and safeguards',
        stepNumber: 3
      },
      metadata: {
        confidence: 85,
        riskLevel: 'low',
        timeToRecover: '3-4 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 2 - Strategist
    {
      id: 's2-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Re-Evaluating\n\n"Now we have rollback and observability in place. Much better safety profile."',
      timestamp: 20,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Re-Evaluate',
        description: 'Assess improved plan with new safety measures',
        stepNumber: 1
      }
    },
    {
      id: 's2-2',
      agent: 'strategist',
      type: 'critique',
      content: '📊 Step 2 — Probing Remaining Gaps\n\n"But what if backup route doesn\'t have capacity? Need to verify before starting ingestion."',
      timestamp: 22,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Probe Remaining Gaps',
        description: 'Identify any remaining potential failure points',
        stepNumber: 2
      }
    },
    {
      id: 's2-3',
      agent: 'strategist',
      type: 'critique',
      content: '⚔️ Step 3 — Additional Improvement\n\n"Add a pre-check: verify at least 30% free capacity before ingestion. This prevents backup route overload."',
      timestamp: 24,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Additional Improvement',
        description: 'Add capacity check to prevent backup route overload',
        stepNumber: 3
      }
    },


    // Round 3 - Planner
    {
      id: 'p3-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Accepting Feedback\n\n"Capacity check makes the plan more robust. Will add pre-flight validation."',
      timestamp: 28,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Accept Feedback',
        description: 'Acknowledge capacity check makes plan more robust',
        stepNumber: 1
      }
    },
    {
      id: 'p3-2',
      agent: 'planner',
      type: 'proposal',
      content: '🧭 Step 2 — Finalizing Execution Flow\n\n"Final Plan steps:\n• Verify backup capacity ≥ 30%\n• Run auto-fix on missing segment\n• Reroute message through backup\n• Start canary at 10%, ramp gradually\n• Abort + rollback if error spikes\n• Notify monitoring hooks"',
      timestamp: 30,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Finalize Execution Flow',
        description: 'Define complete step-by-step execution process',
        stepNumber: 2
      }
    },
    {
      id: 'p3-3',
      agent: 'planner',
      type: 'proposal',
      content: '🧩 Step 3 — Final Plan\n\n"This is safer, fast, and has fallback. Plan A_v3 ready for approval."',
      timestamp: 32,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Present Final Plan',
        description: 'Deliver Plan A_v3 as final proposal',
        stepNumber: 3
      },
      metadata: {
        confidence: 93,
        riskLevel: 'low',
        timeToRecover: '3 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 3 - Strategist
    {
      id: 's3-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Verifying Robustness\n\n"Guardrails ✅ Canary ✅ Rollback ✅ Capacity check ✅. All safety measures in place."',
      timestamp: 34,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Verify Robustness',
        description: 'Confirm all guardrails, canary, rollback, and capacity checks',
        stepNumber: 1
      }
    },
    {
      id: 's3-2',
      agent: 'strategist',
      type: 'agreement',
      content: '📊 Step 2 — Scoring & Confidence\n\n"Success probability: 0.93. TTR: 3 min. Blast radius minimal. High confidence execution."',
      timestamp: 36,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Score & Confidence',
        description: 'Calculate final success probability and risk metrics',
        stepNumber: 2
      }
    },
    {
      id: 's3-3',
      agent: 'strategist',
      type: 'agreement',
      content: '⚔️ Step 3 — Approval\n\n"This is a solid plan. I approve Plan A_v3 for execution."',
      timestamp: 38,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Approve',
        description: 'Give final approval for Plan A_v3 execution',
        stepNumber: 3
      }
    }
  ];

const AgentCollaboration: React.FC<AgentCollaborationProps> = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [plannerThinking, setPlannerThinking] = useState(false);
  const [strategistThinking, setStrategistThinking] = useState(false);
  const [finalSolution, setFinalSolution] = useState<string | null>(null);
  const [showFinalSolution, setShowFinalSolution] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentAgentTodos, setCurrentAgentTodos] = useState<'none' | 'planner' | 'strategist'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageIndex = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const stepsDone = (agent: 'planner' | 'strategist', round: number, done: Set<string>) => {
    const prefix = (agent === 'planner' ? 'p' : 's') + round + '-';
    let count = 0;
    done.forEach(id => { 
      if (id.startsWith(prefix)) count++; 
    });
    return count;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageComplete = useCallback((justFinished?: AgentMessage) => {
    try {
      console.log('Message complete, current index:', currentMessageIndex.current, 'total messages:', agentMessages.length);
      currentMessageIndex.current++;


      if (justFinished && (justFinished.agent === 'planner' || justFinished.agent === 'strategist')) {
        const r = justFinished.round;
        // Create a temporary set that includes the current completed message
        const tempCompletedSteps = new Set([...completedSteps, justFinished.id]);
        const currentStepsDone = stepsDone(justFinished.agent, r, tempCompletedSteps);
        console.log('Message completed:', justFinished.id, justFinished.agent, 'round:', r, 'steps done:', currentStepsDone);
        
        if (justFinished.agent === 'planner' && currentStepsDone === 3) {
          console.log('Planner completed all steps, switching to strategist todos');
          setCurrentAgentTodos('strategist');
        }
        if (justFinished.agent === 'strategist' && currentStepsDone === 3) {
          // Check if there's a next round or if this is the final round
          const nextMessage = agentMessages[currentMessageIndex.current];
          if (nextMessage && nextMessage.round > justFinished.round) {
            console.log('Strategist completed all steps, clearing screen for next round');
            // Clear screen and reset for next round
            setTimeout(() => {
              setMessages([]);
              setCompletedSteps(new Set());
              setCurrentAgentTodos('none');
              
              // Start the next round
              if (currentMessageIndex.current < agentMessages.length) {
                const next = agentMessages[currentMessageIndex.current];
                console.log('Starting next round:', next.id, next.agent, next.type);
                setCurrentRound(next.round);
                setMessages([{ ...next, status: 'active', isTyping: true }]);
                setPlannerThinking(next.agent === 'planner' && next.type === 'thinking');
                setStrategistThinking(next.agent === 'strategist' && next.type === 'thinking');
                
                // Set the correct agent todos for the next round with a small delay
                setTimeout(() => {
                  if (next.agent === 'planner') {
                    setCurrentAgentTodos('planner');
                  } else if (next.agent === 'strategist') {
                    setCurrentAgentTodos('strategist');
                  }
                }, 500);
              }
            }, 1000); // Brief pause before clearing
          } else {
            console.log('Strategist completed all steps, switching to planner todos');
            setCurrentAgentTodos('planner'); // next round's owner
          }
        }
      }

      if (currentMessageIndex.current >= agentMessages.length) {
        setIsRunning(false);
        setShowFinalSolution(true);
        setFinalSolution(`🏁 FINAL AGREED SOLUTION

Planner & Strategist Joint Resolution:

"Execute controlled auto-fix and re-ingestion with capacity check, canary rollout, rollback safeguards, and observability hooks. Expected recovery time: 3 minutes. Minimal operational risk."

🧠 Why it's strong:
✅ Fast recovery (meets SLA)
🛡️ Built-in safety net (canary, rollback, pre-check)
📈 High confidence from both agents (93%)
⚡ Minimal blast radius
🎯 Proven execution plan`);
        return;
      }

      const next = agentMessages[currentMessageIndex.current];
      setCurrentRound(next.round);
      setMessages(prev => [...prev, { ...next, status: 'active', isTyping: true }]);

      // Lights on for the speaking agent; they'll turn off on that message's onComplete
      setPlannerThinking(next.agent === 'planner' && next.type === 'thinking');
      setStrategistThinking(next.agent === 'strategist' && next.type === 'thinking');
      
      // Set the correct agent todos based on who's speaking
      if (next.agent === 'planner') {
        console.log('Setting current agent todos to planner');
        setCurrentAgentTodos('planner');
      } else if (next.agent === 'strategist') {
        console.log('Setting current agent todos to strategist');
        setCurrentAgentTodos('strategist');
      }
    } catch (error) {
      console.error('Error in handleMessageComplete:', error);
      setIsRunning(false);
    }
  }, [completedSteps]);

  const startCollaboration = () => {
    console.log('Starting collaboration with', agentMessages.length, 'messages');
    setIsRunning(true);
    setCurrentRound(0);
    setMessages([]);
    setFinalSolution(null);
    setShowFinalSolution(false);
    setCompletedSteps(new Set());
    setCurrentAgentTodos('planner'); // Show Planner todos immediately
    setCurrentRound(1); // Start with Round 1
    currentMessageIndex.current = 0;
    
    // Show todos first, then start the first message after a delay
    setTimeout(() => {
      try {
        // Start with the first message
        const firstMessage = agentMessages[0];
        if (firstMessage) {
          setMessages([{ ...firstMessage, status: 'active', isTyping: true }]);
          setCurrentRound(firstMessage.round);
          
          // Set thinking states for first message
          if (firstMessage.agent === 'planner' && firstMessage.type === 'thinking') {
            setPlannerThinking(true);
          } else if (firstMessage.agent === 'strategist' && firstMessage.type === 'thinking') {
            setStrategistThinking(true);
          }
          
          // Clear thinking states
          setTimeout(() => {
            setPlannerThinking(false);
            setStrategistThinking(false);
          }, 1500);
        }
      } catch (error) {
        console.error('Error starting collaboration:', error);
        setIsRunning(false);
      }
    }, 1500); // 1.5 second delay to show todos first
  };

  const resetCollaboration = () => {
    setIsRunning(false);
    setCurrentRound(0);
    setMessages([]);
    setPlannerThinking(false);
    setStrategistThinking(false);
    setFinalSolution(null);
    setShowFinalSolution(false);
    setCompletedSteps(new Set());
    setCurrentAgentTodos('none'); // Hide all todos
    setCurrentRound(1); // Reset to Round 1
  };


  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-cyan-900/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Brain className="w-10 h-10 text-cyan-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isRunning ? 'bg-cyan-400' : 'bg-cyan-600'} transition-colors duration-300`}>
                  <div className={`absolute inset-0 rounded-full ${isRunning ? 'animate-ping bg-cyan-400' : ''}`} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Agentic AI Collaboration
                </h1>
                <p className="text-sm text-slate-400">Planner & Strategist Real-Time Problem Solving</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/30 border border-cyan-800/40 rounded-lg">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-400">ROUND {currentRound}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Messages: {messages.length}</span>
            </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  {isRunning ? 'COLLABORATING' : 'READY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Control Panel */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-4">
            <button
              onClick={startCollaboration}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isRunning
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/50'
              }`}
            >
              <Play className="w-5 h-5" />
              Start Collaboration
            </button>
            <button
              onClick={resetCollaboration}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/30 border border-slate-700/40 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Agent Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Planner Status */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🐢</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400">PLANNER</h3>
                <p className="text-sm text-slate-400">Solution Generation & Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${plannerThinking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm text-slate-300">
                {plannerThinking ? 'Thinking...' : 'Idle'}
              </span>
            </div>
          </div>

          {/* Strategist Status */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🦈</div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">STRATEGIST</h3>
                <p className="text-sm text-slate-400">Risk Assessment & Critique</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${strategistThinking ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm text-slate-300">
                {strategistThinking ? 'Analyzing...' : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Split Agent Windows with Integrated Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planner Window - Left */}
          <div className="bg-emerald-950/10 border border-emerald-800/30 rounded-xl overflow-hidden">
            <div className="bg-emerald-950/20 border-b border-emerald-800/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center">
                  <span className="text-emerald-400 text-lg">🐢</span>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg">PLANNER</h3>
                  <p className="text-emerald-300/70 text-sm">Solution Generator</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="text-xs text-emerald-400/70">
                    {Array.from(completedSteps).filter(step => step.startsWith(`p${currentRound}-`)).length} of 3 Steps
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${
                    plannerThinking ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                  }`}>
                    {plannerThinking ? 'THINKING...' : 'READY'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent">
              <div className="p-4 space-y-4">
                {/* Planner Progress Steps - Show when currentAgentTodos is 'planner' */}
                {currentAgentTodos === 'planner' && (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium text-sm">
                        Round {currentRound} - Progress Steps
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {agentMessages
                        .filter(msg => msg.agent === 'planner' && msg.round === currentRound)
                        .map((message) => {
                          const isCompleted = completedSteps.has(message.id);
                          const isActive = messages.some(msg => msg.id === message.id && msg.isTyping);
                          
                          return (
                            <div key={message.id} className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-950/30 border border-emerald-700/50'
                                : isActive
                                ? 'bg-emerald-950/20 border border-emerald-600/40'
                                : 'bg-emerald-950/10 border border-emerald-800/20'
                            }`}>
                              <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-emerald-400 border-2 border-emerald-400'
                                  : isActive
                                  ? 'border-2 border-emerald-400 bg-emerald-400/20'
                                  : 'border-2 border-emerald-400/50'
                              }`}>
                                {isCompleted && <CheckCircle className="w-2 h-2 text-emerald-900" />}
                                {isActive && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium text-xs ${
                                  isCompleted ? 'text-emerald-300' : 
                                  isActive ? 'text-emerald-400' : 'text-emerald-400/60'
                                }`}>
                                  Step {message.todo?.stepNumber}: {message.todo?.title}
                                </div>
                                {message.todo?.description && (
                                  <div className={`text-xs mt-1 ${
                                    isCompleted ? 'text-emerald-400/60' : 
                                    isActive ? 'text-emerald-400/70' : 'text-emerald-400/40'
                                  }`}>
                                    {message.todo.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Planner Messages */}
                {messages.filter(msg => msg.agent === 'planner').length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-emerald-400/60 mb-2">🐢 Planner Ready</div>
                    <div className="text-slate-400 text-sm">Waiting to analyze the problem...</div>
                  </div>
                )}
                {messages.filter(msg => msg.agent === 'planner').map((message, index) => {
                  const stepNumber = message.id.split('-')[1];
                  const isCompleted = completedSteps.has(message.id);
                  
                  
                  return (
                    <div key={message.id} className="space-y-4">
                      {/* Message */}
             <div className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
               <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-slate-500 bg-slate-800/30 px-2 py-1 rounded">
                              Step {stepNumber} • t = {message.timestamp}s
                            </span>
                            {message.isTyping && (
                              <div className="ml-auto flex items-center gap-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <TypewriterText 
                              text={message.content} 
                              isActive={message.isTyping}
                              onComplete={() => {
                       setMessages(prev => prev.map(msg => 
                         msg.id === message.id 
                           ? { ...msg, isTyping: false, status: 'completed' }
                           : msg
                       ));
                       
                       // Mark step as completed using message ID
                       markStepCompleted(message.id);
                                
                                handleMessageComplete(message);
                              }}
                            />
                            {message.isTyping && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-emerald-400 animate-pulse"></div>
                            )}
                          </div>
                          
                          {message.metadata && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="bg-emerald-800/20 border border-emerald-700/30 rounded-lg p-3 text-center hover:bg-emerald-800/30 transition-colors">
                                <div className="text-xs text-emerald-400/70 mb-1">Confidence</div>
                                <div className="text-lg font-bold text-emerald-400">{message.metadata.confidence}%</div>
                                <div className="w-full bg-emerald-900/30 rounded-full h-1 mt-2">
                                  <div 
                                    className="bg-emerald-400 h-1 rounded-full transition-all duration-1000" 
                                    style={{ width: `${message.metadata.confidence}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="bg-emerald-800/20 border border-emerald-700/30 rounded-lg p-3 text-center hover:bg-emerald-800/30 transition-colors">
                                <div className="text-xs text-emerald-400/70 mb-1">TTR</div>
                                <div className="text-lg font-bold text-emerald-400">{message.metadata.timeToRecover}</div>
                                <div className="text-xs text-emerald-400/60 mt-1">Time to Recovery</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

             {/* Step Completion Indicator */}
             {isCompleted && (
               <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-lg p-4 animate-fade-in">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 bg-emerald-400 border-2 border-emerald-400 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-4 h-4 text-emerald-900" />
                   </div>
                   <div className="flex-1">
                     <div className="text-emerald-300 font-medium text-sm">
                       ✅ Step {stepNumber} Completed
                     </div>
                     <div className="text-slate-400 text-xs mt-1">
                       {message.todo?.description || 'Step completed successfully'}
                     </div>
                   </div>
                   <div className="text-xs text-emerald-400/70">
                     {new Date().toLocaleTimeString()}
                   </div>
                 </div>
               </div>
             )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Strategist Window - Right */}
          <div className="bg-blue-950/10 border border-blue-800/30 rounded-xl overflow-hidden">
            <div className="bg-blue-950/20 border-b border-blue-800/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-lg">🦈</span>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold text-lg">STRATEGIST</h3>
                  <p className="text-blue-300/70 text-sm">Risk Assessor</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="text-xs text-blue-400/70">
                    {Array.from(completedSteps).filter(step => step.startsWith(`s${currentRound}-`)).length} of 3 Steps
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${
                    strategistThinking ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                  }`}>
                    {strategistThinking ? 'ANALYZING...' : 'READY'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900/50 scrollbar-track-transparent">
              <div className="p-4 space-y-4">
                {/* Strategist Progress Steps - Show when currentAgentTodos is 'strategist' */}
                {currentAgentTodos === 'strategist' && (
                  <div className="bg-blue-950/20 border border-blue-800/40 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium text-sm">
                        Round {currentRound} - Progress Steps
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {agentMessages
                        .filter(msg => msg.agent === 'strategist' && msg.round === currentRound)
                        .map((message) => {
                          const isCompleted = completedSteps.has(message.id);
                          const isActive = messages.some(msg => msg.id === message.id && msg.isTyping);
                          
                          return (
                            <div key={message.id} className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${
                              isCompleted
                                ? 'bg-blue-950/30 border border-blue-700/50'
                                : isActive
                                ? 'bg-blue-950/20 border border-blue-600/40'
                                : 'bg-blue-950/10 border border-blue-800/20'
                            }`}>
                              <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-blue-400 border-2 border-blue-400'
                                  : isActive
                                  ? 'border-2 border-blue-400 bg-blue-400/20'
                                  : 'border-2 border-blue-400/50'
                              }`}>
                                {isCompleted && <CheckCircle className="w-2 h-2 text-blue-900" />}
                                {isActive && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium text-xs ${
                                  isCompleted ? 'text-blue-300' : 
                                  isActive ? 'text-blue-400' : 'text-blue-400/60'
                                }`}>
                                  Step {message.todo?.stepNumber}: {message.todo?.title}
                                </div>
                                {message.todo?.description && (
                                  <div className={`text-xs mt-1 ${
                                    isCompleted ? 'text-blue-400/60' : 
                                    isActive ? 'text-blue-400/70' : 'text-blue-400/40'
                                  }`}>
                                    {message.todo.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Strategist Messages */}
                {messages.filter(msg => msg.agent === 'strategist').length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-blue-400/60 mb-2">🦈 Strategist Ready</div>
                    <div className="text-slate-400 text-sm">Waiting to evaluate plans...</div>
                  </div>
                )}
                {messages.filter(msg => msg.agent === 'strategist').map((message, index) => {
                  const stepNumber = message.id.split('-')[1];
                  const isCompleted = completedSteps.has(message.id);
                  
                  
                  return (
                    <div key={message.id} className="space-y-4">
                      {/* Message */}
             <div className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
               <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-slate-500 bg-slate-800/30 px-2 py-1 rounded">
                              Step {stepNumber} • t = {message.timestamp}s
                            </span>
                            {message.isTyping && (
                              <div className="ml-auto flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <TypewriterText 
                              text={message.content} 
                              isActive={message.isTyping}
                              onComplete={() => {
                       setMessages(prev => prev.map(msg => 
                         msg.id === message.id 
                           ? { ...msg, isTyping: false, status: 'completed' }
                           : msg
                       ));
                       
                       // Mark step as completed using message ID
                       markStepCompleted(message.id);
                                
                                handleMessageComplete(message);
                              }}
                            />
                            {message.isTyping && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-blue-400 animate-pulse"></div>
                            )}
                          </div>
                          
                          {message.metadata && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="bg-blue-800/20 border border-blue-700/30 rounded-lg p-3 text-center hover:bg-blue-800/30 transition-colors">
                                <div className="text-xs text-blue-400/70 mb-1">Risk Level</div>
                                <div className={`text-lg font-bold ${
                                  message.metadata.riskLevel === 'low' ? 'text-emerald-400' :
                                  message.metadata.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                  {message.metadata.riskLevel?.toUpperCase()}
                                </div>
                                <div className={`w-full rounded-full h-1 mt-2 ${
                                  message.metadata.riskLevel === 'low' ? 'bg-emerald-900/30' :
                                  message.metadata.riskLevel === 'medium' ? 'bg-amber-900/30' : 'bg-red-900/30'
                                }`}>
                                  <div 
                                    className={`h-1 rounded-full transition-all duration-1000 ${
                                      message.metadata.riskLevel === 'low' ? 'bg-emerald-400' :
                                      message.metadata.riskLevel === 'medium' ? 'bg-amber-400' : 'bg-red-400'
                                    }`}
                                    style={{ 
                                      width: message.metadata.riskLevel === 'low' ? '25%' :
                                             message.metadata.riskLevel === 'medium' ? '60%' : '90%'
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="bg-blue-800/20 border border-blue-700/30 rounded-lg p-3 text-center hover:bg-blue-800/30 transition-colors">
                                <div className="text-xs text-blue-400/70 mb-1">Blast Radius</div>
                                <div className="text-lg font-bold text-blue-400">{message.metadata.blastRadius}</div>
                                <div className="text-xs text-blue-400/60 mt-1">Impact Scope</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

             {/* Step Completion Indicator */}
             {isCompleted && (
               <div className="bg-blue-950/30 border border-blue-700/50 rounded-lg p-4 animate-fade-in">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 bg-blue-400 border-2 border-blue-400 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-4 h-4 text-blue-900" />
                   </div>
                   <div className="flex-1">
                     <div className="text-blue-300 font-medium text-sm">
                       ✅ Step {stepNumber} Completed
                     </div>
                     <div className="text-slate-400 text-xs mt-1">
                       {message.todo?.description || 'Step completed successfully'}
                     </div>
                   </div>
                   <div className="text-xs text-blue-400/70">
                     {new Date().toLocaleTimeString()}
                   </div>
                 </div>
               </div>
             )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Final Solution */}
        {showFinalSolution && finalSolution && (
          <div className="mt-8 bg-gradient-to-r from-emerald-950/20 to-blue-950/20 border border-emerald-800/40 rounded-xl p-6 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-emerald-400 font-bold text-2xl">Final Agreed Solution</h3>
                <p className="text-emerald-300/70 text-sm">Planner & Strategist Joint Resolution</p>
              </div>
              <div className="ml-auto">
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                  <span className="text-emerald-400 font-bold text-sm">APPROVED</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700/40 rounded-lg p-6 mb-6">
              <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {finalSolution}
              </pre>
            </div>

            {/* Solution Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-emerald-800/20 border border-emerald-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">93%</div>
                <div className="text-xs text-emerald-400/70">Success Probability</div>
              </div>
              <div className="bg-blue-800/20 border border-blue-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">3 min</div>
                <div className="text-xs text-blue-400/70">Time to Recovery</div>
              </div>
              <div className="bg-amber-800/20 border border-amber-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">LOW</div>
                <div className="text-xs text-amber-400/70">Risk Level</div>
              </div>
              <div className="bg-purple-800/20 border border-purple-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">MINIMAL</div>
                <div className="text-xs text-purple-400/70">Blast Radius</div>
              </div>
            </div>

            {/* Execution Status */}
            <div className="mt-6 bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">Ready for Duty Officer Approval</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
  } catch (error) {
    console.error('Error rendering AgentCollaboration:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Error in Agent Collaboration</div>
          <div className="text-slate-400 mb-4">Something went wrong. Please try refreshing the page.</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-950/30 border border-red-800/40 rounded-lg text-red-400 hover:bg-red-950/50 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default AgentCollaboration;
