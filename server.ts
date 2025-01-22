import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './src/middleware/errorHandler';
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import jobRoutes from './src/routes/jobRoutes';
import companyRoutes from './src/routes/companyRoutes';
import candidateRoutes from './src/routes/candidateRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

