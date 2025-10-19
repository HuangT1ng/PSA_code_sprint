import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const incidentController = new IncidentController();

// Get all incidents
router.get('/', authMiddleware, incidentController.getAllIncidents);

// Get incident by ID
router.get('/:id', authMiddleware, incidentController.getIncidentById);

// Create new incident
router.post('/', authMiddleware, incidentController.createIncident);

// Update incident status
router.patch('/:id/status', authMiddleware, incidentController.updateIncidentStatus);

// Get incident analysis
router.get('/:id/analysis', authMiddleware, incidentController.getIncidentAnalysis);

// Request AI analysis for incident
router.post('/:id/analyze', authMiddleware, incidentController.analyzeIncident);

// Escalate incident
router.post('/:id/escalate', authMiddleware, incidentController.escalateIncident);

// Get escalation details
router.get('/:id/escalation', authMiddleware, incidentController.getEscalation);

// Get incident timeline
router.get('/:id/timeline', authMiddleware, incidentController.getIncidentTimeline);

// Search incidents
router.post('/search', authMiddleware, incidentController.searchIncidents);

export default router;

