import app from './app';
import logger from './utils/logger';
import env from './config/environment.config';

// The starter file of your project here where we will start our nodejs server when connected with your DB

app.listen(env.app.port, () => {
  logger.info(`Server is running on port: ${env.app.port}...`);
});
