export interface KnowledgeNode {
  id: string;
  name: string;
  type: 'module' | 'issue' | 'resolution';
  description: string;
  metadata: {
    service?: string;
    severity?: string;
    frequency?: number;
    lastOccurrence?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: 'causes' | 'resolves' | 'related_to' | 'depends_on';
  weight: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface KnowledgeQuery {
  query: string;
  context?: string;
  filters?: {
    service?: string;
    severity?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export interface KnowledgeResult {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  relevanceScore: number;
  suggestions: string[];
}

