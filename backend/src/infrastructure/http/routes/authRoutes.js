import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { authRateLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validateBody } from '../middlewares/schemaValidator.js';
import { loginSchema } from '../schemas/authSchemas.js';

const router = Router();

router.post('/login', authRateLimiter, validateBody(loginSchema), login);

export default router;