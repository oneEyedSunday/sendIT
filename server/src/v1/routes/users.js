/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */

import { Router } from 'express';
import usersController from '../controllers/users';
import Middleware from '../middlewares';


/**
 * Express router to mount parcel related functions on.
 * @type {object}
 * @const
 * @namespace parcelsRouter
 */
const router = Router();

/**
 * Route serving users index.
 * @name get/users
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.get('/', Middleware.isAdmin, usersController.index);

/**
 * Route serving getting a parcel.
 * @name get/parcels
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id/parcels', usersController.getParcels);
export default router;
