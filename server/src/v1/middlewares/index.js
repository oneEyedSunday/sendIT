import jwt from 'jsonwebtoken';
import DBHelpers from '../models/helpers';

/** Class representing Middleware functions. */
export default class Middleware {
  /**
 * Middleware to ensure request is from an authenticated user.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static async isAuth(req, res, next) {
    // return next();
    if (req.url === '/api' || req.url === '/api/' || req.url === '/api/v1/auth/signup' || req.url === '/api/v1/auth/login') return next();
    let token = req.headers.authorization || req.query.token;
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, process.env.secret, (err, payload) => {
        if (err) return res.json({ auth: false, message: 'Invalid token' });
        req.user = payload;
        next();
      });
    } else {
      return res.status(401).json({
        auth: false,
        message: 'Authorization token is not provided.',
      });
    }
  }

  /**
 * Middleware to ensure request is from an admin.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static async isAdmin(req, res, next) {
    if (req.user.admin) {
      next();
    } else {
      return res.status(401).send({ error: 'Not authorized for admin access' });
    }
  }

  /**
 * Middleware to ensure parcel requested exists.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static async parcelExists(req, res, next) {
    try {
      const parcel = await DBHelpers.find('parcels', req.params.id);
      req.parcel = parcel;
      return next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
 * Middleware to ensure request for parcel is from owner of parcel.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static async isOwner(req, res, next) {
    try {
      const test = (req.parcel.userid === req.user.id);
      if (test) return next();
      return res.status(403).send({ error: 'You do not have access to this resource' });
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }

  /**
 * Middleware to ensure request for parcel is from owner or admin.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static async isOwnerOrAdmin(req, res, next) {
    // return next();
    if (!req.user.admin) {
      // not admin, check if its
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'You do not have access to this resource' });
      }
      next();
    }
    next();
  }
}
