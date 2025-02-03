import express from 'express';
import {
  getAllUser,
  getUserByExternalId,
  resendVerificationEmail,
  updateUser,
  updateUserDetails,
  updateUserKycDetails,
  getUsersWithPayments,
  approveUserPayment,
} from './user.controller';
import { authmiddleWare, isAdmin } from '../auth/auth.middleWare';

const userRouter = express.Router();

// Base URL /api/user
userRouter.get('/', authmiddleWare(), getAllUser);
userRouter.get('/auth/authExternalId', getUserByExternalId);
userRouter.post(
  '/auth/resend-email-verification',
  authmiddleWare(),
  resendVerificationEmail,
);
userRouter.patch('/:userId', authmiddleWare(), updateUser);
userRouter.patch('/userdetails/:userId', authmiddleWare(), updateUserDetails);
userRouter.patch('/kycdetails/:userId', authmiddleWare(), updateUserKycDetails);
// userRouter.post('/:userId/toggle-status', authmiddleWare(), toggleUserStatus);
userRouter.get(
  '/with-payments',
  authmiddleWare(),
  isAdmin(),
  getUsersWithPayments,
);
userRouter.put(
  '/:userId/approve-payment',
  authmiddleWare(),
  isAdmin(),
  approveUserPayment,
);

export default userRouter;
