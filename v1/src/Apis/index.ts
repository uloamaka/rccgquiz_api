import { StatusCodes } from 'http-status-codes';
import authRoutes from './auth/route';
import BaseController from '../Utils/base-controller';
import { Application } from 'express';
import path from 'path';

function router(app: Application, version: string) {
  app.use(version, authRoutes);

  app.get('/health', async (_req, res, _next) => {
    const healthcheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: 'OK',
      status: StatusCodes.OK,
      timestamp: Date.now(),
    };
    try {
      res.send(healthcheck);
    } catch (error: any) {
      healthcheck.message = error;
      BaseController.responseHandler(
        res,
        StatusCodes.SERVICE_UNAVAILABLE,
        'Service unavailable'
      );
    }
  });

  app.get('/docs', (req, res) => {
      res.sendFile(path.join(__dirname, 'Public', 'swagger.yaml'));
  });

  // No matching route found
  app.use((req, res, next) => {
    BaseController.responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      'Resource does not exist, check endpoint or method'
    );
  });
}

export default router;
