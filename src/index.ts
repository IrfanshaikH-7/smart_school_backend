import app from './app';
import { config } from './config';
import logger from './utils/logger';

const startServer = () => {
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();