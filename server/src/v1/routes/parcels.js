/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */

import { Router } from 'express';
import ParcelsController from '../controllers/parcels';
import Middleware from '../middlewares';

const { isAdmin, parcelExists, isOwner } = Middleware;
const {
  index, getOrder,
  cancelOrder, changeOrderDestination, updateOrderLocation, updateOrderStatus,
  createOrder
} = ParcelsController;

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
router.get('/', isAdmin, index);

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
router.put('/:id/cancel', parcelExists, Middleware.isOwner, cancelOrder);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/destination', parcelExists, isOwner, changeOrderDestination);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/status', isAdmin, parcelExists, updateOrderStatus);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/presentLocation', isAdmin, parcelExists, updateOrderLocation);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/', createOrder);

export default router;
