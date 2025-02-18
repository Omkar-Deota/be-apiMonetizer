import express from 'express';
import { getAllUser, getUserByExternalId } from './user.controller';
import { authmiddleWare } from '../auth/auth.middleWare';

const userRouter = express.Router();

// Base URL /api/user

userRouter.get('/', authmiddleWare(), getAllUser);

userRouter.get('/auth/authExternalId', authmiddleWare(), getUserByExternalId);

export default userRouter;
