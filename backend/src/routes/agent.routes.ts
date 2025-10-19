import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const agentController = new AgentController();

// Start agent collaboration session
router.post('/sessions', authMiddleware, agentController.startSession);

// Get session by ID
router.get('/sessions/:id', authMiddleware, agentController.getSession);

// Get all sessions
router.get('/sessions', authMiddleware, agentController.getAllSessions);

// Get session messages
router.get('/sessions/:id/messages', authMiddleware, agentController.getSessionMessages);

// Add message to session
router.post('/sessions/:id/messages', authMiddleware, agentController.addMessage);

// Get session solution
router.get('/sessions/:id/solution', authMiddleware, agentController.getSessionSolution);

// Approve/reject solution
router.patch('/sessions/:id/solution/approve', authMiddleware, agentController.approveSolution);

// Get agent thoughts
router.get('/sessions/:id/thoughts', authMiddleware, agentController.getAgentThoughts);

// Stop session
router.post('/sessions/:id/stop', authMiddleware, agentController.stopSession);

export default router;

