/** Express router providing user related routes
 * @module routes/parcels
 * @requires express
 */
import { Router } from 'express';
import authController from '../controllers/auth';

const { signup, login } = authController;

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
router.post('/signup', signup);

/**
 * Route serving logging in.
 * @name post/login
 * @function
 * @memberof module:routes/auth~authRouter
 * @inner
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', login);
export default router;
