export interface Incident {
  id: string;
  timestamp: Date;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  module: string;
  action: string;
  entity?: string;
  message: string;
  details?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'escalated';
  assignedTo?: string;
  rootCause?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentAnalysis {
  incidentId: string;
  aiAnalysis: {
    problem: string;
    impact: string;
    systemBehavior: string;
    proposedSolution: {
      title: string;
      description: string;
      steps: string[];
      estimatedTime: string;
      riskLevel: 'low' | 'medium' | 'high';
      confidence: number;
      blastRadius: string;
    };
  };
  createdAt: Date;
}

export interface IncidentEscalation {
  id: string;
  incidentId: string;
  ticketId: string;
  priority: string;
  assignedTeam: string;
  estimatedResolution: string;
  ticketingSystem: string;
  ticketUrl: string;
  slackChannel: string;
  runbookUrl: string;
  notificationsSent: string[];
  nextSteps: string[];
  status: 'initiated' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

