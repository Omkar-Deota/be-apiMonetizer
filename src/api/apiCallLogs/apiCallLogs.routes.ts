import { Router } from 'express';
import {
  getUserDailyApiCalls,
  getTotalDailyApiCalls,
} from './apiCallLogs.controller';
import { authmiddleWare } from '../auth/auth.middleWare';

const router = Router();

router.get('/user-daily', authmiddleWare(), getUserDailyApiCalls);
router.get('/total-daily', authmiddleWare(), getTotalDailyApiCalls);

export default router;
