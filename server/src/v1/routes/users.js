import { Router } from 'express';
import usersController from '../controllers/users';

const router = Router();
router.get('/', usersController.index);
export default router;
