import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/', parcelsController.index);
router.get('/:id', parcelsController.get);
router.put('/:id/cancel', parcelsController.cancel);
router.post('/', parcelsController.create);
export default router;
