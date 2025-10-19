import { Router } from 'express';
import { KnowledgeBaseController } from '../controllers/knowledgeBase.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const knowledgeBaseController = new KnowledgeBaseController();

// Get knowledge graph
router.get('/graph', authMiddleware, knowledgeBaseController.getKnowledgeGraph);

// Search knowledge base
router.post('/search', authMiddleware, knowledgeBaseController.searchKnowledgeBase);

// Get node by ID
router.get('/nodes/:id', authMiddleware, knowledgeBaseController.getNodeById);

// Create new node
router.post('/nodes', authMiddleware, knowledgeBaseController.createNode);

// Update node
router.patch('/nodes/:id', authMiddleware, knowledgeBaseController.updateNode);

// Delete node
router.delete('/nodes/:id', authMiddleware, knowledgeBaseController.deleteNode);

// Get edge by ID
router.get('/edges/:id', authMiddleware, knowledgeBaseController.getEdgeById);

// Create new edge
router.post('/edges', authMiddleware, knowledgeBaseController.createEdge);

// Delete edge
router.delete('/edges/:id', authMiddleware, knowledgeBaseController.deleteEdge);

// Get related nodes
router.get('/nodes/:id/related', authMiddleware, knowledgeBaseController.getRelatedNodes);

// Get node history
router.get('/nodes/:id/history', authMiddleware, knowledgeBaseController.getNodeHistory);

export default router;

