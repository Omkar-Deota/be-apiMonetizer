import express from 'express';
import { saveUser } from '../user/user.controller';
import { authmiddleWare } from './auth.middleWare';
// Base Route:- /api/auth
const authRouter = express.Router();

authRouter.post('/login', authmiddleWare(), saveUser);

export default authRouter;
