import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/:id', parcelsController.get);
export default router;
