import dotenv from 'dotenv';
dotenv.config({
  path: '../.env',
});
import express, { Request, Response } from 'express';
import cors from 'cors';
import { subscriptionRoute, userRoutes } from './api';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/v1/subscription', subscriptionRoute);

app.get('/', (_req: Request, res: Response) =>
  res.status(200).send("Hello Dev's"),
);

app.all('*', (_req: Request, res: Response) =>
  res.status(404).send('Route does not exists'),
);

export default app;
