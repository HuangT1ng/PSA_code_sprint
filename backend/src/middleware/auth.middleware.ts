import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    // Placeholder implementation - would verify JWT token here
    // For now, just attach a mock user
    req.user = {
      id: 'mock-user-id',
      username: 'dutyofficer',
      role: 'duty_officer'
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

