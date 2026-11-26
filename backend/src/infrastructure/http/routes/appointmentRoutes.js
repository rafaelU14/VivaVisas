import { Router } from 'express';
import { getAvailability } from '../controllers/appointmentController.js';
import { verifyAuthToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyAuthToken);

router.get('/disponibilidad', getAvailability);

export default router;