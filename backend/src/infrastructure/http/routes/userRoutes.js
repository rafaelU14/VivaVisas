import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { requireRoles, verifyAuthToken } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/schemaValidator.js';
import { createUserSchema } from '../schemas/authSchemas.js';

const router = Router();

router.use(verifyAuthToken);
router.use(requireRoles('ADMIN'));

router.get('/', getUsers);
router.post('/', validateBody(createUserSchema), createUser);

export default router;