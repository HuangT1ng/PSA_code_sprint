# PSA Sentinel Backend API

Backend API server for the PSA Sentinel AI-Powered Event Detection System.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Real-time**: Socket.IO
- **Logging**: Winston

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database connection and queries
│   ├── middleware/       # Express middleware
│   ├── models/           # TypeScript interfaces/types
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── server.ts         # Main server entry point
├── dist/                 # Compiled JavaScript (generated)
├── logs/                 # Application logs (generated)
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id/status` - Update incident status
- `GET /api/incidents/:id/analysis` - Get incident analysis
- `POST /api/incidents/:id/analyze` - Request AI analysis
- `POST /api/incidents/:id/escalate` - Escalate incident
- `GET /api/incidents/:id/escalation` - Get escalation details
- `GET /api/incidents/:id/timeline` - Get incident timeline
- `POST /api/incidents/search` - Search incidents

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/:id/health` - Get service health
- `GET /api/services/:id/metrics` - Get service metrics
- `GET /api/services/:id/logs` - Get service logs
- `POST /api/services/:id/logs` - Ingest service log
- `GET /api/services/:id/status` - Get service status
- `PATCH /api/services/:id/status` - Update service status

### Knowledge Base
- `GET /api/knowledge-base/graph` - Get knowledge graph
- `POST /api/knowledge-base/search` - Search knowledge base
- `GET /api/knowledge-base/nodes/:id` - Get node by ID
- `POST /api/knowledge-base/nodes` - Create new node
- `PATCH /api/knowledge-base/nodes/:id` - Update node
- `DELETE /api/knowledge-base/nodes/:id` - Delete node
- `GET /api/knowledge-base/edges/:id` - Get edge by ID
- `POST /api/knowledge-base/edges` - Create new edge
- `DELETE /api/knowledge-base/edges/:id` - Delete edge
- `GET /api/knowledge-base/nodes/:id/related` - Get related nodes
- `GET /api/knowledge-base/nodes/:id/history` - Get node history

### Agent Collaboration
- `POST /api/agents/sessions` - Start agent collaboration session
- `GET /api/agents/sessions/:id` - Get session by ID
- `GET /api/agents/sessions` - Get all sessions
- `GET /api/agents/sessions/:id/messages` - Get session messages
- `POST /api/agents/sessions/:id/messages` - Add message to session
- `GET /api/agents/sessions/:id/solution` - Get session solution
- `PATCH /api/agents/sessions/:id/solution/approve` - Approve/reject solution
- `GET /api/agents/sessions/:id/thoughts` - Get agent thoughts
- `POST /api/agents/sessions/:id/stop` - Stop session

### Duty Officer Dashboard
- `GET /api/duty-officer/dashboard/summary` - Get dashboard summary
- `GET /api/duty-officer/incidents/pending` - Get pending incidents
- `POST /api/duty-officer/incidents/:id/approve` - Approve incident resolution
- `POST /api/duty-officer/incidents/:id/reject` - Reject incident resolution
- `POST /api/duty-officer/incidents/:id/custom-solution` - Add custom solution
- `GET /api/duty-officer/incidents/:id/escalation-summary` - Get escalation summary
- `GET /api/duty-officer/activity-log` - Get activity log

## WebSocket Events

### Client -> Server
- `join:incident` - Join incident room
- `leave:incident` - Leave incident room
- `join:session` - Join agent session room
- `leave:session` - Leave agent session room
- `join:service` - Join service monitoring room

### Server -> Client
- `incident:update` - Incident updated
- `agent:message` - New agent message
- `service:log` - New service log
- `service:metrics` - Service metrics update

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run compiled JavaScript
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Setup

```sql
-- Create database
CREATE DATABASE psa_sentinel;

-- Run migrations (to be implemented)
```

## Notes

**This backend is currently a placeholder implementation.**

All endpoints return mock data and are not connected to a real database or AI service. This structure provides:
- Complete API surface area
- Proper TypeScript types
- Express route organization
- Middleware structure
- WebSocket event handling
- Logging infrastructure

To make this production-ready, you would need to:
1. Implement database models and queries
2. Connect to actual AI/ML services
3. Add comprehensive error handling
4. Implement JWT authentication
5. Add input validation
6. Write unit and integration tests
7. Set up CI/CD pipelines

