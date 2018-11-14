import { Router } from 'express';
import parcelsController from '../controllers/parcels';
import Middleware from '../middlewares';

const router = Router();
router.get('/', Middleware.isAdmin, parcelsController.index);
router.get('/:id', Middleware.parcelExists, parcelsController.getOrder);
router.put('/:id/cancel', Middleware.parcelExists, Middleware.isOwner, parcelsController.cancelOrder);
router.put('/:id/destination', Middleware.parcelExists, Middleware.isOwner, parcelsController.changeOrderDestination);
router.put('/:id/status', Middleware.isAdmin, Middleware.parcelExists, parcelsController.updateOrderStatus);
router.put('/:id/presentLocation', Middleware.isAdmin, Middleware.parcelExists, parcelsController.updateOrderLocation);
router.post('/', parcelsController.createOrder);
export default router;
