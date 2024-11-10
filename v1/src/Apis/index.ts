import { StatusCodes } from 'http-status-codes';
import authRoutes from './auth/route';
import userRoute from './user-profile/route'
import BaseController from '../Utils/base-controller';
import { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'; 

function router(app: Application, version: string) {
  app.use(version, authRoutes);
  app.use(version, userRoute)

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

  try {
  const swaggerDocument = YAML.load('../v1/src/swagger.yaml');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.sendFile(path.join(__dirname, '../swagger.yaml'));
  });
  } catch (error) {
    console.error('Error loading Swagger file:', error);
  }

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
