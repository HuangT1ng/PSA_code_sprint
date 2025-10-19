export interface AgentSession {
  id: string;
  incidentId: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  currentRound: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  agent: 'planner' | 'strategist' | 'system';
  type: 'thinking' | 'proposal' | 'critique' | 'agreement' | 'system';
  content: string;
  round: number;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    timeToRecover?: string;
    blastRadius?: string;
  };
}

export interface AgentSolution {
  id: string;
  sessionId: string;
  incidentId: string;
  solution: {
    title: string;
    description: string;
    steps: string[];
    estimatedTime: string;
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
    blastRadius: string;
  };
  plannerApproval: boolean;
  strategistApproval: boolean;
  dutyOfficerApproval?: boolean;
  status: 'proposed' | 'approved' | 'rejected' | 'implemented';
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentThought {
  id: string;
  sessionId: string;
  agent: 'planner' | 'strategist';
  thoughtType: 'analysis' | 'hypothesis' | 'action' | 'result';
  content: string;
  timestamp: Date;
}

