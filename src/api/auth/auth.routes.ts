import express from 'express';
import { saveUser } from '../user/user.controller';
import { apiKeyMiddleware } from './auth.middleWare';
// Base Route:- /api/auth
const authRouter = express.Router();

authRouter.post('/admin/login', apiKeyMiddleware(), saveUser);

export default authRouter;
