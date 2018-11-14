import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/', parcelsController.index);
router.get('/:id', parcelsController.getOrder);
router.put('/:id/cancel', parcelsController.cancelOrder);
router.put('/:id/destination', parcelsController.changeDestinationOfOrder);
router.post('/', parcelsController.createOrder);
export default router;
