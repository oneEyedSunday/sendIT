import { Router } from 'express';
import usersController from '../controllers/users';

const router = Router();
router.get('/', usersController.index);
router.post('/signup', usersController.create);
router.post('/signin', usersController.login);
router.get('/:id([0-9]+)/parcels', usersController.parcels);
export default router;
