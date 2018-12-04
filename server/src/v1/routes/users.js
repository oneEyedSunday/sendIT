/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */

import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import Middleware from '../middlewares';

const { isAdmin, isOwnerOrAdmin } = Middleware;
const { getAUsersParcels, getAllUsers } = UsersController;


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
router.get('/', isAdmin, getAllUsers);

/**
 * Route serving getting a parcel.
 * @name get/parcels
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id/parcels', isOwnerOrAdmin, getAUsersParcels);
export default router;
