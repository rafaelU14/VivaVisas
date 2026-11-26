import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from '../database/data-source.js';
import clientRoutes from './routes/clientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimitMiddleware.js';

const app = express();

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
];
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Bloqueado por política CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', apiRateLimiter);
app.get('/', (req, res) => {
  res.json({ message: 'Backend de VivaVisas funcionando correctamente con Arquitectura Hexagonal' });
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: AppDataSource.isInitialized ? 'conectada' : 'desconectada',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/citas', appointmentRoutes);
app.use(errorHandler);
export default app;