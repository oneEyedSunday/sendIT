/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */
import { Router } from 'express';
import authController from '../controllers/auth';

/**
 * Express router to mount authentication related functions on.
 * @type {object}
 * @const
 * @namespace authRouter
 */
const router = Router();

/**
 * Route serving signing up.
 * @name post/signup
 * @function
 * @memberof module:routes/auth~authRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.post('/signup', authController.signup);

/**
 * Route serving logging in.
 * @name post/login
 * @function
 * @memberof module:routes/auth~authRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', authController.login);
export default router;
