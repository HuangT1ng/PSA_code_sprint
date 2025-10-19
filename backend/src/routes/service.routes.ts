import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const serviceController = new ServiceController();

// Get all services
router.get('/', authMiddleware, serviceController.getAllServices);

// Get service by ID
router.get('/:id', authMiddleware, serviceController.getServiceById);

// Get service health
router.get('/:id/health', authMiddleware, serviceController.getServiceHealth);

// Get service metrics
router.get('/:id/metrics', authMiddleware, serviceController.getServiceMetrics);

// Get service logs
router.get('/:id/logs', authMiddleware, serviceController.getServiceLogs);

// Ingest service log
router.post('/:id/logs', authMiddleware, serviceController.ingestLog);

// Get service status
router.get('/:id/status', authMiddleware, serviceController.getServiceStatus);

// Update service status
router.patch('/:id/status', authMiddleware, serviceController.updateServiceStatus);

export default router;

