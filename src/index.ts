import app from './app';
import log from './utils/logger';
import env from './config/environment.config';
import { AppDataSource } from './config/database.config';

// The starter file of your project here where we will start our nodejs server when connected with your DB

AppDataSource.initialize()
  .then(() => {
    log.info('Data Base has been initialized!');

    app.listen(env.app.port, () => {
      log.info(`Server is running on port: ${env.app.port}`);
    });
  })
  .catch((err) => {
    log.error(err);
    log.error(
      'Error during Data Source initialization:',
      (err as Error)?.message,
    );
    process.exit(1);
  });
