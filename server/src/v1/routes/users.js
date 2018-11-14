import { Router } from 'express';
import usersController from '../controllers/users';
import Middleware from '../middlewares';

const router = Router();
router.get('/', usersController.index);
router.get('/:id/parcels', Middleware.isOwnerOrAdmin, usersController.getParcels);
export default router;
