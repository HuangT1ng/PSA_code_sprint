import { Server as SocketServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export const initializeWebSocket = (io: SocketServer) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join incident room
    socket.on('join:incident', (incidentId: string) => {
      socket.join(`incident:${incidentId}`);
      logger.info(`Client ${socket.id} joined incident room: ${incidentId}`);
    });

    // Leave incident room
    socket.on('leave:incident', (incidentId: string) => {
      socket.leave(`incident:${incidentId}`);
      logger.info(`Client ${socket.id} left incident room: ${incidentId}`);
    });

    // Join agent session room
    socket.on('join:session', (sessionId: string) => {
      socket.join(`session:${sessionId}`);
      logger.info(`Client ${socket.id} joined session room: ${sessionId}`);
    });

    // Leave agent session room
    socket.on('leave:session', (sessionId: string) => {
      socket.leave(`session:${sessionId}`);
      logger.info(`Client ${socket.id} left session room: ${sessionId}`);
    });

    // Join service monitoring room
    socket.on('join:service', (serviceName: string) => {
      socket.join(`service:${serviceName}`);
      logger.info(`Client ${socket.id} joined service room: ${serviceName}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper functions to emit events
export const emitIncidentUpdate = (io: SocketServer, incidentId: string, data: any) => {
  io.to(`incident:${incidentId}`).emit('incident:update', data);
};

export const emitAgentMessage = (io: SocketServer, sessionId: string, message: any) => {
  io.to(`session:${sessionId}`).emit('agent:message', message);
};

export const emitServiceLog = (io: SocketServer, serviceName: string, log: any) => {
  io.to(`service:${serviceName}`).emit('service:log', log);
};

export const emitServiceMetrics = (io: SocketServer, serviceName: string, metrics: any) => {
  io.to(`service:${serviceName}`).emit('service:metrics', metrics);
};

