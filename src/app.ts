import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

app.get('/', (_req: Request, res: Response) =>
  res.status(200).send("Hello Dev's"),
);

app.all('*', (_req: Request, res: Response) =>
  res.status(404).send('Route does not exists'),
);

export default app;
