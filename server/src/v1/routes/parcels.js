/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */

import { Router } from 'express';
import ParcelsController from '../controllers/parcels';
import Middleware from '../middlewares';
import ValidationMiddleware from '../middlewares/validation';

const { isAdmin, parcelExists, isOwner } = Middleware;
const {
  getAllOrders, getOrder,
  cancelOrder, changeOrderDestination, updateOrderLocation, updateOrderStatus,
  createOrder
} = ParcelsController;

const {
  parcelCreationValidation, parcelDestinationUpdateValidation,
  parcelStatusUpdateValidation,
  parcelLocationUpdateValidation
} = ValidationMiddleware;

/**
 * Express router to mount parcel related functions on.
 * @type {object}
 * @const
 * @namespace parcelsRouter
 */

const router = Router();

/**
 * Route serving parcel index.
 * @name get/parcels
 * @function
 * @memberof module:routes/parcels~parcelsRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.get('/', isAdmin, getAllOrders);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id', parcelExists, getOrder);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/cancel', parcelExists, isOwner, cancelOrder);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/destination', parcelExists, isOwner, parcelDestinationUpdateValidation, changeOrderDestination);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/status', isAdmin, parcelExists, parcelStatusUpdateValidation, updateOrderStatus);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/presentLocation', isAdmin, parcelExists, parcelLocationUpdateValidation, updateOrderLocation);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/', parcelCreationValidation, createOrder);

export default router;
