import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, 
  CheckCircle, 
  Activity,
  MessageSquare,
  RotateCcw,
  Sparkles,
  CheckSquare,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface AgentMessage {
  id: string;
  agent: 'planner' | 'strategist' | 'system';
  type: 'thinking' | 'proposal' | 'critique' | 'agreement' | 'system' | 'clear' | 'approval';
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
    <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </pre>
  );
};

// Define incidents from Sentinel monitor - Only ERROR and WARN events
const sentinelIncidents = [
  {
    id: 'inc-1',
    time: 'Oct 9, 08:25',
    level: 'ERROR' as const,
    service: 'Container Service',
    action: 'Duplicate Snapshot',
    entity: 'CMAU0000020',
    message: 'Duplicate container information received in PORTNET',
  },
  {
    id: 'inc-2',
    time: 'Oct 4, 12:25',
    level: 'ERROR' as const,
    service: 'EDI Service',
    action: 'IFTMIN',
    entity: 'REF-IFT-0007',
    message: 'EDI message processing failed - Segment missing',
  },
  {
    id: 'inc-3',
    time: 'Oct 9, 08:30',
    level: 'WARN' as const,
    service: 'Vessel Registry',
    action: 'Flag Update',
    entity: 'IMO: 9300007',
    message: 'Vessel flag updated with high frequency warning',
  },
  {
    id: 'inc-4',
    time: 'Oct 9, 09:20',
    level: 'WARN' as const,
    service: 'Container Service',
    action: 'Duplicate Snapshot',
    entity: 'TEMU0000045',
    message: 'Duplicate snapshot event detected within time window',
  },
];

// Define messages outside component to avoid recreation
const containerMessages: AgentMessage[] = [
    // Round 1 - Planner
    {
      id: 'p1-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Understanding the Problem\n\nContainer deduplication filter failed for CMAU0000020. PORTNET now shows duplicate records. Need to assess deduplication logic and impact. ',
      timestamp: 0,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Understand the Problem',
        description: 'Analyze container deduplication failure, assess impact on PORTNET',
        stepNumber: 1
      }
    },
    {
      id: 'p1-2',
      agent: 'planner',
      type: 'thinking',
      content: '🧭 Step 2 — Exploring Solution Paths\n\nGenerated three options:\n• Option A: Purge duplicate + enable hash validation\n• Option B: Wait for manual intervention\n• Option C: Manual purge with extended window',
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
      content: '🧩 Step 3 — Initial Plan Proposal\n\nProposing Plan A: Auto-purge with hash validation and monitoring.\n• Identify duplicate record\n• Remove from PORTNET\n• Enable content hash check\n• Monitor deduplication filter',
      timestamp: 4,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Form Initial Plan',
        description: 'Propose auto-purge solution with hash validation and monitoring',
        stepNumber: 3
      },
      metadata: {
        confidence: 75,
        riskLevel: 'medium',
        timeToRecover: '2-3 min',
        blastRadius: 'Container Service, PORTNET Integration'
      }
    },

    // Round 1 - Strategist
    {
      id: 's1-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Evaluating Each Candidate\n\nScoring options:\n• Plan A: Fast (2-3min) but moderate risk\n• Plan B: Fails SLA (too slow)\n• Plan C: Too slow, manual overhead',
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
      content: '📊 Step 2 — Identifying Weaknesses\n\nPlan A has gaps:\n• No canary rollout protection\n• No abort conditions if errors spike\n• No capacity validation for backup route',
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
      content: '⚔️ Step 3 — Recommending Improvements\n\nAdd safety measures:\n• Canary ingestion ramping 10% every minute\n• Auto-rollback if error rate exceeds 1%\n• Alert hooks before reroute',
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
      content: '🧠 Step 1 — Absorbing Feedback\n\nStrategist wants safety measures. Good call. Need to integrate progressive validation, rollback conditions, and observability.',
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
      content: '🧭 Step 2 — Integrating Changes\n\nModify Plan A to include:\n• Progressive validation deployment\n• Auto-rollback if duplicate rate exceeds 1%\n• Alert hook before purge operation',
      timestamp: 16,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Integrate Changes',
        description: 'Modify plan with progressive validation, rollback, and alerts',
        stepNumber: 2
      }
    },
    {
      id: 'p2-3',
      agent: 'planner',
      type: 'proposal',
      content: '🧩 Step 3 — Refined Plan\n\nRefined Plan A_v2: auto-purge with progressive validation and abort safeguards.\n• Progressive hash validation\n• Real-time duplicate monitoring\n• Automatic rollback triggers',
      timestamp: 18,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Propose Refined Plan',
        description: 'Present Plan A_v2 with progressive validation and safeguards',
        stepNumber: 3
      },
      metadata: {
        confidence: 85,
        riskLevel: 'low',
        timeToRecover: '3-4 min',
        blastRadius: 'Container Service, PORTNET Integration'
      }
    },

    // Round 2 - Strategist
    {
      id: 's2-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Re-Evaluating\n\nNow we have rollback and observability in place. Much better safety profile.',
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
      content: '📊 Step 2 — Probing Remaining Gaps\n\nBut what if backup route doesn\'t have capacity? Need to verify before starting ingestion.',
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
      content: '⚔️ Step 3 — Additional Improvement\n\nAdd a pre-check: verify at least 30% free capacity before ingestion. This prevents backup route overload.',
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
      content: '🧠 Step 1 — Accepting Feedback\n\nEvent window check makes the plan more robust. Will add pre-flight validation.',
      timestamp: 28,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Accept Feedback',
        description: 'Acknowledge event window check makes plan more robust',
        stepNumber: 1
      }
    },
    {
      id: 'p3-2',
      agent: 'planner',
      type: 'proposal',
      content: '🧭 Step 2 — Finalizing Execution Flow\n\nFinal Plan steps:\n• Verify deduplication window ≥ 60s\n• Identify duplicate CMAU0000020\n• Purge duplicate from PORTNET\n• Enable hash validation gradually\n• Abort + rollback if duplicates spike\n• Notify monitoring hooks',
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
      content: '🧩 Step 3 — Final Plan\n\nThis is safer, fast, and has fallback. Plan A_v3 ready for approval.',
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
        blastRadius: 'Container Service, PORTNET Integration'
      }
    },

    // Round 3 - Strategist
    {
      id: 's3-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Verifying Robustness\n\nGuardrails ✅ Canary ✅ Rollback ✅ Capacity check ✅. All safety measures in place.',
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
      content: '📊 Step 2 — Scoring & Confidence\n\nSuccess probability: 0.93. TTR: 3 min. Blast radius minimal. High confidence execution.',
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
      content: '⚔️ Step 3 — Approval\n\nThis is a solid plan. I approve Plan A_v3 for execution.',
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

// EDI incident messages
const ediMessages: AgentMessage[] = [
    // Round 1 - Planner
    {
      id: 'p1-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Understanding the Problem\n\nEDI message REF-IFT-0007 failed processing due to missing segment. Translator stuck in error state. Need to assess segment validation and recovery options.',
      timestamp: 0,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Understand the Problem',
        description: 'Analyze EDI processing failure, assess impact on container timeline',
        stepNumber: 1
      }
    },
    {
      id: 'p1-2',
      agent: 'planner',
      type: 'thinking',
      content: '🧭 Step 2 — Exploring Solution Paths\n\nGenerated three options:\n• Option A: Patch segment + reprocess internally\n• Option B: Request partner resend\n• Option C: Manual fix with relaxed validation',
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
      content: '🧩 Step 3 — Initial Plan Proposal\n\nProposing Plan A: Auto-patch with segment validation and monitoring.\n• Identify missing LOC segment\n• Patch with default values\n• Reprocess through translator\n• Monitor timeline updates',
      timestamp: 4,
      round: 1,
      status: 'pending',
      todo: {
        title: 'Form Initial Plan',
        description: 'Propose auto-patch solution with segment validation and monitoring',
        stepNumber: 3
      },
      metadata: {
        confidence: 75,
        riskLevel: 'medium',
        timeToRecover: '8-12 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 1 - Strategist
    {
      id: 's1-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Evaluating Each Candidate\n\nScoring options:\n• Plan A: Moderate speed (8-12min), low-medium risk\n• Plan B: Slow (2+ hours), depends on partner\n• Plan C: Fast but high risk to data integrity',
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
      content: '📊 Step 2 — Identifying Weaknesses\n\nPlan A has gaps:\n• No validation of patched segment accuracy\n• No rollback if reprocessing fails\n• Missing acknowledgment to partner system',
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
      content: '⚔️ Step 3 — Recommending Improvements\n\nAdd safety measures:\n• Validate patched segment against manifest\n• Enable rollback if container data inconsistent\n• Send acknowledgment to partner after success',
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
      content: '🧠 Step 1 — Absorbing Feedback\n\nStrategist wants safety measures. Good call. Need to integrate segment validation, rollback conditions, and partner acknowledgment.',
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
      content: '🧭 Step 2 — Integrating Changes\n\nModify Plan A to include:\n• Cross-validate patched segment with manifest\n• Auto-rollback if timeline data inconsistent\n• Send partner acknowledgment after success',
      timestamp: 16,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Integrate Changes',
        description: 'Modify plan with validation, rollback, and acknowledgment',
        stepNumber: 2
      }
    },
    {
      id: 'p2-3',
      agent: 'planner',
      type: 'proposal',
      content: '🧩 Step 3 — Refined Plan\n\nRefined Plan A_v2: auto-patch with validation and abort safeguards.\n• Segment validation with manifest\n• Real-time timeline monitoring\n• Automatic rollback triggers',
      timestamp: 18,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Propose Refined Plan',
        description: 'Present Plan A_v2 with validation and safeguards',
        stepNumber: 3
      },
      metadata: {
        confidence: 85,
        riskLevel: 'low',
        timeToRecover: '10-15 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 2 - Strategist
    {
      id: 's2-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Re-Evaluating\n\nNow we have validation and rollback in place. Much better safety profile.',
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
      content: '📊 Step 2 — Probing Remaining Gaps\n\nBut what if partner expects different segment format? Need to check EDI schema version compatibility before patching.',
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
      content: '⚔️ Step 3 — Additional Improvement\n\nAdd a pre-check: verify EDI schema version matches expected format. This prevents incompatible segment patching.',
      timestamp: 24,
      round: 2,
      status: 'pending',
      todo: {
        title: 'Additional Improvement',
        description: 'Add schema validation to prevent format mismatch',
        stepNumber: 3
      }
    },


    // Round 3 - Planner
    {
      id: 'p3-1',
      agent: 'planner',
      type: 'thinking',
      content: '🧠 Step 1 — Accepting Feedback\n\nSchema version check makes the plan more robust. Will add pre-flight validation.',
      timestamp: 28,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Accept Feedback',
        description: 'Acknowledge schema check makes plan more robust',
        stepNumber: 1
      }
    },
    {
      id: 'p3-2',
      agent: 'planner',
      type: 'proposal',
      content: '🧭 Step 2 — Finalizing Execution Flow\n\nFinal Plan steps:\n• Verify EDI schema version matches\n• Identify missing LOC segment\n• Patch with manifest-validated defaults\n• Reprocess through translator\n• Abort + rollback if timeline inconsistent\n• Send partner acknowledgment',
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
      content: '🧩 Step 3 — Final Plan\n\nThis is safer, efficient, and has fallback. Plan A_v3 ready for approval.',
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
        timeToRecover: '10 min',
        blastRadius: 'EDI Translator, Container Timeline'
      }
    },

    // Round 3 - Strategist
    {
      id: 's3-1',
      agent: 'strategist',
      type: 'thinking',
      content: '🧠 Step 1 — Final Evaluation\n\nPlan A_v3 looks solid. All major risks addressed. Schema validation, rollback, and acknowledgment all in place.',
      timestamp: 34,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Final Evaluation',
        description: 'Perform final risk assessment on Plan A_v3',
        stepNumber: 1
      }
    },
    {
      id: 's3-2',
      agent: 'strategist',
      type: 'critique',
      content: '📊 Step 2 — Last Check\n\nTimeline monitoring looks good. Partner acknowledgment ensures visibility. Rollback protects data integrity.',
      timestamp: 36,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Last Check',
        description: 'Verify all safeguards are properly implemented',
        stepNumber: 2
      }
    },
    {
      id: 's3-3',
      agent: 'strategist',
      type: 'approval',
      content: '✅ Step 3 — APPROVAL\n\nPlan A_v3 is APPROVED. Risk is low, recovery time acceptable, and all safety measures are in place. Ready to execute.',
      timestamp: 38,
      round: 3,
      status: 'pending',
      todo: {
        title: 'Grant Approval',
        description: 'Approve Plan A_v3 for execution',
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
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>(containerMessages);
  const [finalSolution, setFinalSolution] = useState<string | null>(null);
  const [showFinalSolution, setShowFinalSolution] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentAgentTodos, setCurrentAgentTodos] = useState<'none' | 'planner' | 'strategist'>('none');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [completedSteps, agentMessages]);

  const startCollaboration = (incidentId: string) => {
    console.log('Starting collaboration for incident:', incidentId);
    setSelectedIncident(incidentId);
    setIsLoading(true);
    
    // Select appropriate messages based on incident
    const selectedMessages = incidentId === 'inc-2' ? ediMessages : containerMessages;
    setAgentMessages(selectedMessages);
    
    // Show loading for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
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
          // Start with the first message from selectedMessages
          const firstMessage = selectedMessages[0];
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
    }, 2000); // 2 second loading period
  };

  const resetCollaboration = () => {
    setIsRunning(false);
    setIsLoading(false);
    setCurrentRound(0);
    setMessages([]);
    setPlannerThinking(false);
    setStrategistThinking(false);
    setFinalSolution(null);
    setShowFinalSolution(false);
    setCompletedSteps(new Set());
    setCurrentAgentTodos('none'); // Hide all todos
    setCurrentRound(1); // Reset to Round 1
    setSelectedIncident(null); // Clear selected incident
  };


  try {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-white" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isRunning ? 'bg-white' : 'bg-white/60'} transition-colors duration-300`}>
                <div className={`absolute inset-0 rounded-full ${isRunning ? 'animate-ping bg-white' : ''}`} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-medium text-white tracking-tight">Agentic AI Collaboration</h2>
              <p className="text-sm text-white/60">Planner & Strategist Real-Time Problem Solving</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
              <Activity className="w-4 h-4 text-white animate-pulse" />
              <span className="text-sm font-medium text-white">ROUND {currentRound}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <MessageSquare className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">Messages: {messages.length}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <Activity className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">
                {isRunning ? 'COLLABORATING' : 'READY'}
              </span>
            </div>
          </div>
        </div>
        {/* Incident Selection Panel - Show only when no incident is selected */}
        {!selectedIncident && (
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Select Incident to Resolve</h3>
            </div>
            
            <div className="space-y-4">
              {sentinelIncidents.map((incident) => {
                const getIcon = () => {
                  if (incident.level === 'ERROR') return <XCircle className="w-4 h-4 text-red-400" />;
                  if (incident.level === 'WARN') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                  return <CheckCircle className="w-4 h-4 text-cyan-400" />;
                };
                
                const getColor = () => {
                  if (incident.level === 'ERROR') return 'text-red-400';
                  if (incident.level === 'WARN') return 'text-yellow-400';
                  return 'text-cyan-400';
                };
                
                return (
                  <button
                    key={incident.id}
                    onClick={() => startCollaboration(incident.id)}
                    className="relative w-full p-4 rounded-xl border transition-all duration-300 text-left bg-[#6b5d4f]/20 border-white/10 hover:bg-[#6b5d4f]/30 hover:border-white/20 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-xl" />
                    
                    <div className="flex items-start gap-4">
                      {/* Level Badge */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getIcon()}
                        <span className={`text-xs font-bold ${getColor()}`}>
                          {incident.level}
                        </span>
                      </div>
                      
                      {/* Service & Time */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm font-semibold text-white">
                            {incident.service}
                          </div>
                          <div className="text-xs text-white/50">
                            {incident.time}
                          </div>
                        </div>
                        
                        {/* Entity */}
                        <div className="text-xs text-white/60 font-mono mb-2">
                          {incident.entity}
                        </div>
                        
                        {/* Message */}
                        <div className="text-sm text-white/70">
                          {incident.message}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State - Show during 2 second loading period */}
        {selectedIncident && isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Initializing AI Collaboration</h3>
              <p className="text-sm text-white/60">Preparing Planner and Strategist agents...</p>
            </div>
          </div>
        )}

        {/* Agent Collaboration Section - Show only when incident is selected and loading is complete */}
        {selectedIncident && !isLoading && (
          <>
            {/* Reset Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={resetCollaboration}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Stop
              </button>
            </div>

            {/* Agent Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Planner Status */}
          <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🐢</div>
              <div>
                <h3 className="text-xl font-bold text-white">PLANNER</h3>
                <p className="text-sm text-white/60">Solution Generation & Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${plannerThinking ? 'bg-white animate-pulse' : 'bg-white/30'}`} />
              <span className="text-sm text-white/80">
                {plannerThinking ? 'Thinking...' : 'Idle'}
              </span>
            </div>
          </div>

          {/* Strategist Status */}
          <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🦈</div>
              <div>
                <h3 className="text-xl font-bold text-white">STRATEGIST</h3>
                <p className="text-sm text-white/60">Risk Assessment & Critique</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${strategistThinking ? 'bg-white animate-pulse' : 'bg-white/30'}`} />
              <span className="text-sm text-white/80">
                {strategistThinking ? 'Analyzing...' : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Split Agent Windows with Integrated Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planner Window - Left */}
          <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center">
                  <span className="text-emerald-400 text-lg">🐢</span>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg">PLANNER</h3>
                  <p className="text-white/70 text-sm">Solution Generator</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="text-xs text-white/70">
                    {Array.from(completedSteps).filter(step => step.startsWith(`p${currentRound}-`)).length} of 3 Steps
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${
                    plannerThinking ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/60'
                  }`}>
                    {plannerThinking ? 'THINKING...' : 'READY'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="p-4 space-y-4">
                {/* Planner Progress Steps - Show when currentAgentTodos is 'planner' */}
                {currentAgentTodos === 'planner' && (
                  <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/40 rounded-lg p-4 mb-4">
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
                                ? 'bg-emerald-500/20 border border-emerald-500/50'
                                : isActive
                                ? 'bg-emerald-500/10 border border-emerald-500/40'
                                : 'bg-black/30 border border-emerald-500/20'
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
                              <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-3 text-center hover:bg-black/50 transition-colors">
                                <div className="text-xs text-emerald-400/70 mb-1">Confidence</div>
                                <div className="text-lg font-bold text-emerald-400">{message.metadata.confidence}%</div>
                                <div className="w-full bg-black/30 rounded-full h-1 mt-2">
                                  <div 
                                    className="bg-emerald-400 h-1 rounded-full transition-all duration-1000" 
                                    style={{ width: `${message.metadata.confidence}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-3 text-center hover:bg-black/50 transition-colors">
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
               <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/40 rounded-lg p-4 animate-fade-in">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 bg-emerald-400 border-2 border-emerald-400 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-4 h-4 text-emerald-900" />
                   </div>
                   <div className="flex-1">
                     <div className="text-emerald-400 font-medium text-sm">
                       ✅ Step {stepNumber} Completed
                     </div>
                     <div className="text-white/60 text-xs mt-1">
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
          <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-[#6b5d4f]/20 backdrop-blur-sm border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-lg">🦈</span>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold text-lg">STRATEGIST</h3>
                  <p className="text-white/70 text-sm">Risk Assessor</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="text-xs text-white/70">
                    {Array.from(completedSteps).filter(step => step.startsWith(`s${currentRound}-`)).length} of 3 Steps
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${
                    strategistThinking ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/60'
                  }`}>
                    {strategistThinking ? 'ANALYZING...' : 'READY'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="p-4 space-y-4">
                {/* Strategist Progress Steps - Show when currentAgentTodos is 'strategist' */}
                {currentAgentTodos === 'strategist' && (
                  <div className="bg-black/40 backdrop-blur-sm border border-blue-500/40 rounded-lg p-4 mb-4">
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
                                ? 'bg-blue-500/20 border border-blue-500/50'
                                : isActive
                                ? 'bg-blue-500/10 border border-blue-500/40'
                                : 'bg-black/30 border border-blue-500/20'
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
                              <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-center hover:bg-black/50 transition-colors">
                                <div className="text-xs text-blue-400/70 mb-1">Risk Level</div>
                                <div className={`text-lg font-bold ${
                                  message.metadata.riskLevel === 'low' ? 'text-emerald-400' :
                                  message.metadata.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                  {message.metadata.riskLevel?.toUpperCase()}
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-1 mt-2">
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
                              <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-center hover:bg-black/50 transition-colors">
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
               <div className="bg-black/40 backdrop-blur-sm border border-blue-500/40 rounded-lg p-4 animate-fade-in">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 bg-blue-400 border-2 border-blue-400 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-4 h-4 text-blue-900" />
                   </div>
                   <div className="flex-1">
                     <div className="text-blue-400 font-medium text-sm">
                       ✅ Step {stepNumber} Completed
                     </div>
                     <div className="text-white/60 text-xs mt-1">
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
          <div className="mt-8 bg-[#6b5d4f]/20 border border-white/20 rounded-xl p-6 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-2xl">Final Agreed Solution</h3>
                <p className="text-white/70 text-sm">Planner & Strategist Joint Resolution</p>
              </div>
              <div className="ml-auto">
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                  <span className="text-emerald-400 font-bold text-sm">APPROVED</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 border border-white/10 rounded-lg p-6 mb-6">
              <pre className="text-white/80 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {finalSolution}
              </pre>
            </div>

            {/* Solution Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">93%</div>
                <div className="text-xs text-emerald-400/70">Success Probability</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">3 min</div>
                <div className="text-xs text-blue-400/70">Time to Recovery</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">LOW</div>
                <div className="text-xs text-amber-400/70">Risk Level</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">MINIMAL</div>
                <div className="text-xs text-purple-400/70">Blast Radius</div>
              </div>
            </div>

            {/* Execution Status */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 font-medium">Ready for Duty Officer Approval</span>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering AgentCollaboration:', error);
    return (
      <div className="p-6 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Error in Agent Collaboration</div>
          <div className="text-white/60 mb-4">Something went wrong. Please try refreshing the page.</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default AgentCollaboration;
