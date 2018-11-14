import { Router } from 'express';
import parcelsController from '../controllers/parcels';
import Middleware from '../middlewares';

const router = Router();
router.get('/', parcelsController.index);
router.get('/:id', Middleware.parcelExists, parcelsController.getOrder);
router.put('/:id/cancel', Middleware.parcelExists, Middleware.isOwner, parcelsController.cancelOrder);
router.put('/:id/destination', Middleware.parcelExists, Middleware.isOwner, parcelsController.changeOrderDestination);
router.put('/:id/status', Middleware.isAdmin, Middleware.parcelExists, Middleware.isOwner, parcelsController.changeOrderStatus);
router.post('/', parcelsController.createOrder);
export default router;
