import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { logger } from './utils/logger';
import { config } from './config';
import incidentRoutes from './routes/incident.routes';
import serviceRoutes from './routes/service.routes';
import knowledgeBaseRoutes from './routes/knowledgeBase.routes';
import agentRoutes from './routes/agent.routes';
import dutyOfficerRoutes from './routes/dutyOfficer.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { initializeWebSocket } from './services/websocket.service';

const app: Application = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/incidents', incidentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/duty-officer', dutyOfficerRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Initialize WebSocket
initializeWebSocket(io);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`🚀 PSA Sentinel Backend running on port ${PORT}`);
  logger.info(`📡 WebSocket server initialized`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});

export { app, io };

