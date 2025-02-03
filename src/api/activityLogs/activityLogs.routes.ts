import express from 'express';
import * as activityLogsController from './activityLogs.controller';
import { authmiddleWare } from '../auth/auth.middleWare';

const router = express.Router();

// Get activities for the authenticated user
router.get('/user', authmiddleWare(), activityLogsController.getUserActivities);

// Get all activities (admin only)
router.get('/all', authmiddleWare(), activityLogsController.getAllActivities);

export default router;
