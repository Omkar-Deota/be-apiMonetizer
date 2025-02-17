import express, { Request, Response } from 'express';
import cors from 'cors';

import {
  userRouter,
  authRouter,
} from './api';

import { logApi } from './middlewares/logApi';
// import SchedulerService from './services/scheduler.service';

const app = express();

// middleWares
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://propstream-fe.onrender.com'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth Routes
app.use('/api/auth', logApi(), authRouter);

// User Routes
app.use('/api/user', logApi(), userRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send("Welcome Dev's");
});

app.all('*', (_req: Request, res: Response) => {
  res.status(404).send('Route does not exists');
});

export default app;
