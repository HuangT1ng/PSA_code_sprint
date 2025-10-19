-- PSA Sentinel Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'duty_officer', 'analyst'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'edi', 'vessel', 'container', 'api', 'berth'
    status VARCHAR(50) DEFAULT 'healthy', -- 'healthy', 'degraded', 'down'
    uptime DECIMAL(5,2) DEFAULT 100.00,
    last_health_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL,
    level VARCHAR(20) NOT NULL, -- 'ERROR', 'WARN', 'INFO', 'DEBUG'
    service_id UUID REFERENCES services(id),
    module VARCHAR(50),
    action VARCHAR(255),
    entity VARCHAR(255),
    message TEXT NOT NULL,
    details JSONB,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'investigating', 'resolved', 'escalated'
    assigned_to UUID REFERENCES users(id),
    root_cause TEXT,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident Analysis table
CREATE TABLE IF NOT EXISTS incident_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id),
    ai_analysis JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident Escalations table
CREATE TABLE IF NOT EXISTS incident_escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id),
    ticket_id VARCHAR(255) NOT NULL,
    priority VARCHAR(50),
    assigned_team VARCHAR(255),
    estimated_resolution VARCHAR(100),
    ticketing_system VARCHAR(100),
    ticket_url TEXT,
    slack_channel VARCHAR(255),
    runbook_url TEXT,
    notifications_sent JSONB,
    next_steps JSONB,
    status VARCHAR(50) DEFAULT 'initiated', -- 'initiated', 'in_progress', 'resolved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Logs table
CREATE TABLE IF NOT EXISTS service_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id),
    timestamp TIMESTAMP NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    correlation_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_logs_service_id ON service_logs(service_id);
CREATE INDEX idx_service_logs_timestamp ON service_logs(timestamp DESC);
CREATE INDEX idx_service_logs_level ON service_logs(level);

-- Service Metrics table
CREATE TABLE IF NOT EXISTS service_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id),
    request_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    average_response_time DECIMAL(10,2),
    success_rate DECIMAL(5,2),
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base Nodes table
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'module', 'issue', 'resolution'
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base Edges table
CREATE TABLE IF NOT EXISTS knowledge_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID REFERENCES knowledge_nodes(id),
    target_node_id UUID REFERENCES knowledge_nodes(id),
    relationship VARCHAR(50) NOT NULL, -- 'causes', 'resolves', 'related_to', 'depends_on'
    weight DECIMAL(3,2) DEFAULT 1.00,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent Sessions table
CREATE TABLE IF NOT EXISTS agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id),
    status VARCHAR(50) DEFAULT 'initializing', -- 'initializing', 'running', 'completed', 'failed'
    current_round INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Agent Messages table
CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES agent_sessions(id),
    agent VARCHAR(50) NOT NULL, -- 'planner', 'strategist', 'system'
    type VARCHAR(50) NOT NULL, -- 'thinking', 'proposal', 'critique', 'agreement', 'system'
    content TEXT NOT NULL,
    round INTEGER NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent Solutions table
CREATE TABLE IF NOT EXISTS agent_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES agent_sessions(id),
    incident_id UUID REFERENCES incidents(id),
    solution JSONB NOT NULL,
    planner_approval BOOLEAN DEFAULT FALSE,
    strategist_approval BOOLEAN DEFAULT FALSE,
    duty_officer_approval BOOLEAN,
    status VARCHAR(50) DEFAULT 'proposed', -- 'proposed', 'approved', 'rejected', 'implemented'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent Thoughts table
CREATE TABLE IF NOT EXISTS agent_thoughts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES agent_sessions(id),
    agent VARCHAR(50) NOT NULL, -- 'planner', 'strategist'
    thought_type VARCHAR(50) NOT NULL, -- 'analysis', 'hypothesis', 'action', 'result'
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Duty Officer Activity Log table
CREATE TABLE IF NOT EXISTS duty_officer_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    incident_id UUID REFERENCES incidents(id),
    action VARCHAR(100) NOT NULL, -- 'approved', 'rejected', 'custom_solution', 'escalated'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_service_id ON incidents(service_id);
CREATE INDEX idx_incidents_timestamp ON incidents(timestamp DESC);
CREATE INDEX idx_incidents_level ON incidents(level);

CREATE INDEX idx_agent_messages_session_id ON agent_messages(session_id);
CREATE INDEX idx_agent_messages_round ON agent_messages(round);

CREATE INDEX idx_knowledge_edges_source ON knowledge_edges(source_node_id);
CREATE INDEX idx_knowledge_edges_target ON knowledge_edges(target_node_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_escalations_updated_at BEFORE UPDATE ON incident_escalations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_nodes_updated_at BEFORE UPDATE ON knowledge_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_solutions_updated_at BEFORE UPDATE ON agent_solutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

