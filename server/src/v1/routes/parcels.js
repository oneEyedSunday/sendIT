import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/', parcelsController.index);
export default router;
