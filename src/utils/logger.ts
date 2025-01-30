import logger from 'pino';
import env from '../config/environment.config';
import { appEnv } from './constants';

const log = logger({
  base: { pid: false },
  transport: {
    target: 'pino-pretty',
    options: {
        colorized: true
    },
  },
  timestamp: () => `,"time": "${new Date().toLocaleString()}"`,
  level: env.environment === appEnv.prod ? 'silent' : 'info',
});

export default log;
