/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */

import { Router } from 'express';
import parcelsController from '../controllers/parcels';
import Middleware from '../middlewares';

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
router.get('/', Middleware.isAdmin, parcelsController.index);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id', Middleware.parcelExists, parcelsController.getOrder);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/cancel', Middleware.parcelExists, Middleware.isOwner, parcelsController.cancelOrder);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/destination', Middleware.parcelExists, Middleware.isOwner, parcelsController.changeOrderDestination);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/status', Middleware.isAdmin, Middleware.parcelExists, parcelsController.updateOrderStatus);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.put('/:id/presentLocation', Middleware.isAdmin, Middleware.parcelExists, parcelsController.updateOrderLocation);

/**
 * Route serving login form.
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/', parcelsController.createOrder);

export default router;
