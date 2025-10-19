import { Router } from 'express';
import { DutyOfficerController } from '../controllers/dutyOfficer.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const dutyOfficerController = new DutyOfficerController();

// Get dashboard summary
router.get('/dashboard/summary', authMiddleware, dutyOfficerController.getDashboardSummary);

// Get pending incidents for review
router.get('/incidents/pending', authMiddleware, dutyOfficerController.getPendingIncidents);

// Approve incident resolution
router.post('/incidents/:id/approve', authMiddleware, dutyOfficerController.approveIncident);

// Reject incident resolution
router.post('/incidents/:id/reject', authMiddleware, dutyOfficerController.rejectIncident);

// Add custom solution
router.post('/incidents/:id/custom-solution', authMiddleware, dutyOfficerController.addCustomSolution);

// Get escalation summary
router.get('/incidents/:id/escalation-summary', authMiddleware, dutyOfficerController.getEscalationSummary);

// Get duty officer activity log
router.get('/activity-log', authMiddleware, dutyOfficerController.getActivityLog);

export default router;

