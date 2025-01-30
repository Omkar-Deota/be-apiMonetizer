import { appEnv } from '../utils/constants';
import env from './environment.config';

const isLocal = env.environment == appEnv.local;

// connect with db here and export a promise to use that in index.ts file
