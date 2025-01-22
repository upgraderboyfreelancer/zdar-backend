import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import companyRoutes from './routes/companyRoutes';
import candidateRoutes from './routes/candidateRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler as (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void);

export default app;

