import { Router } from 'express';
import usersController from '../controllers/users';
import Middleware from '../middlewares';

const router = Router();
router.get('/', Middleware.isAdmin, usersController.index);
router.get('/:id/parcels', usersController.getParcels);
export default router;
