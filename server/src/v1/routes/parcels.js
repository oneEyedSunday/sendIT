import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/:id', parcelsController.get);
router.get('/:id', parcelsController.get);
router.put('/:id/cancel', parcelsController.cancel);
export default router;
