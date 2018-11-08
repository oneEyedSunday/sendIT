import { Router } from 'express';
import parcelsController from '../controllers/parcels';

const router = Router();
router.get('/', parcelsController.index);
router.get('/:id([0-9]+)', parcelsController.get);
router.put('/:id([0-9]+)/cancel', parcelsController.cancel);
router.post('/', parcelsController.create);
export default router;
