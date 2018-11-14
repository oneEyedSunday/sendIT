import { Router } from 'express';
import usersController from '../controllers/users';

const router = Router();
router.get('/', usersController.index);
router.get('/:id/parcels', usersController.getParcels);
export default router;
