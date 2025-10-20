# PortGuardian X+ 

PortGuardian X+ is a comprehensive Agentic event detection and incident management system designed for port operations. It provides real-time monitoring, intelligent analysis, and collaborative resolution of operational incidents across PSA's digital infrastructure.

## 🚀 Features

### Real-Time Monitoring
- **Live Event Stream**: Real-time monitoring of all port operations and system events
- **Service Health Dashboard**: Comprehensive monitoring of 6+ critical services including EDI, API, Berth, Container, and Vessel services
- **Anomaly Detection**: AI-powered pattern recognition to identify unusual events and potential issues

### Intelligent Incident Management
- **Automated Incident Creation**: AI automatically creates incidents from detected anomalies
- **Smart Analysis**: Advanced AI analysis provides root cause analysis and suggested resolutions
- **Escalation Management**: Intelligent escalation workflows with duty officer oversight

### Collaborative AI Agents
- **Multi-Agent Collaboration**: Specialized AI agents work together to solve complex incidents
- **Agent Communication**: Real-time collaboration between Detective, Pathfinder, and other specialized agents
- **Solution Validation**: Human-in-the-loop validation of AI-generated solutions

### Knowledge Management
- **Dynamic Knowledge Graph**: Self-updating knowledge base with relationships between incidents, solutions, and patterns
- **Historical Analysis**: Pattern recognition across historical incidents for predictive insights
- **Searchable Knowledge Base**: Comprehensive search across all operational knowledge

### Duty Officer Dashboard
- **Executive Overview**: High-level dashboard for duty officers and management
- **Pending Reviews**: Streamlined approval workflow for AI-generated solutions
- **Activity Tracking**: Complete audit trail of all system activities and decisions

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Real-time Updates**: WebSocket integration for live data streaming
- **Responsive Design**: Optimized for desktop and tablet use
- **Component Architecture**: Modular, reusable components for maintainability

### Backend (Python Flask)
- **RESTful API**: Comprehensive REST API with 50+ endpoints
- **Real-time Communication**: WebSocket support for live updates
- **Microservice Ready**: Designed for horizontal scaling
- **CORS Enabled**: Cross-origin support for frontend integration

### Data Layer
- **MySQL Database**: Robust relational database for operational data
- **Log Aggregation**: Centralized logging from all port services
- **Knowledge Graph**: Graph database for relationship mapping

## 📊 System Components

### Core Services Monitored
1. **EDI Advice Service** - Electronic Data Interchange processing
2. **API Event Service** - API gateway and event processing
3. **Berth Application** - Berth allocation and management
4. **Container Service** - Container tracking and operations
5. **Vessel Advice** - Vessel scheduling and coordination
6. **Vessel Registry** - Vessel information management

### AI Agents
- **Detective Agent**: Root cause analysis and investigation
- **Pathfinder Agent**: Solution discovery and optimization
- **Pattern Recognition Agent**: Historical analysis and prediction
- **Collaboration Agent**: Multi-agent coordination

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### Backend
- **Python 3.x** - Backend runtime
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **WebSocket** - Real-time communication

### Database
- **MySQL 8.0+** - Primary database
- **Graph Database** - Knowledge relationships

### DevOps
- **Docker** - Containerization
- **Git** - Version control
- **ESLint** - Code quality
- **TypeScript** - Type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MySQL 8.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PSA_code_sprint
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install flask flask-cors
   ```

4. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p < "Problem Statement 3 - Redefining Level 2 Product Ops/Database/db.sql"
   ```

5. **Configure environment**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python server.py
   ```
   The API will be available at `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user information

### Incident Management
- `GET /api/incidents` - List all incidents
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/:id/analysis` - Get AI analysis
- `POST /api/incidents/:id/escalate` - Escalate incident

### Service Monitoring
- `GET /api/services` - List all services
- `GET /api/services/:id/health` - Service health status
- `GET /api/services/:id/logs` - Service logs
- `POST /api/services/:id/logs` - Ingest new logs

### Knowledge Base
- `GET /api/knowledge-base/graph` - Knowledge graph data
- `POST /api/knowledge-base/search` - Search knowledge
- `GET /api/knowledge-base/nodes/:id` - Get knowledge node

### Agent Collaboration
- `POST /api/agents/sessions` - Start agent session
- `GET /api/agents/sessions/:id/messages` - Session messages
- `POST /api/agents/sessions/:id/messages` - Add message

## 🎯 Use Cases

### Port Operations
- **Container Tracking**: Monitor container movements and detect discrepancies
- **Vessel Management**: Track vessel arrivals, departures, and berth allocations
- **EDI Processing**: Monitor electronic data interchange for errors and delays

### Incident Response
- **Automated Detection**: AI identifies anomalies in real-time
- **Root Cause Analysis**: Deep investigation into incident causes
- **Solution Generation**: AI suggests and validates resolution steps
- **Human Oversight**: Duty officers review and approve solutions

### Knowledge Management
- **Pattern Recognition**: Learn from historical incidents
- **Solution Reuse**: Apply successful solutions to similar problems
- **Continuous Learning**: System improves with each incident

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=appdb
DB_USER=your_username
DB_PASSWORD=your_password

# AI Service Configuration
AI_SERVICE_URL=http://localhost:5000
AI_API_KEY=your_ai_api_key
```

### Service Configuration
Each monitored service can be configured with:
- Log file paths
- Health check endpoints
- Alert thresholds
- Escalation rules

## 📈 Monitoring & Analytics

### Real-time Metrics
- Service health status
- Incident response times
- AI agent performance
- System throughput

### Historical Analytics
- Incident trends and patterns
- Resolution effectiveness
- Service reliability metrics
- Knowledge base growth

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control
- Session management
- Password policies

### Data Protection
- Encrypted data transmission
- Secure API endpoints
- Audit logging
- Data retention policies

## 🚀 Deployment

### Production Deployment
1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy backend**
   ```bash
   cd backend
   python server.py
   ```

3. **Configure reverse proxy** (nginx/Apache)
4. **Set up SSL certificates**
5. **Configure monitoring and logging**

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software developed for PSA International.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**PortGuardian X+** - Transforming port operations through intelligent automation and AI-powered insights.
