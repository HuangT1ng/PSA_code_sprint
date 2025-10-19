export interface Service {
  id: string;
  name: string;
  type: 'edi' | 'vessel' | 'container' | 'api' | 'berth';
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastHealthCheck: Date;
  metrics: ServiceMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  warningCount: number;
  averageResponseTime: number;
  successRate: number;
  lastError?: {
    timestamp: Date;
    message: string;
    code?: string;
  };
}

export interface ServiceLog {
  id: string;
  serviceId: string;
  timestamp: Date;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  metadata?: Record<string, any>;
  correlationId?: string;
}

