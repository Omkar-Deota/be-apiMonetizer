import express from 'express';
import { saveUser } from '../user/user.controller';
import { apiKeymiddleWare } from './auth.middleWare';
// Base Route:- /api/auth
const authRouter = express.Router();

authRouter.post('/login', apiKeymiddleWare(), saveUser);

export default authRouter;
