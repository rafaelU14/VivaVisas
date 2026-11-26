import { Router } from 'express';
import * as clientController from '../controllers/clientController.js';
import { validateClientId, validateClientPayload } from '../middlewares/clientValidation.js';
import { verifyAuthToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyAuthToken);

router.post('/', validateClientPayload, clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', validateClientId, clientController.getClientById);
router.put('/:id', validateClientId, validateClientPayload, clientController.updateClient);
router.delete('/:id', validateClientId , clientController.deleteClient);

export default router;