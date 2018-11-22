import jwt from 'jsonwebtoken';
import DBHelpers from '../models/helpers';

/** Class representing Middleware functions. */
export default class Middleware {
/**
 * Middleware to ensure request body is syntactically correct JSON
 * if content-type is text/plain.
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static ensureJSONCompliant(req, res, next) {
    try {
      if (req.headers['content-type'] === 'text/plain') {
        req.body = JSON.parse(req.body);
      }
      next();
    } catch (error) {
      return res.status(400).json({ error: 'You sent a badly formatted JSON as text, please correct' });
    }
  }

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
    let token = req.headers.authorization;
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
      const parcel = await DBHelpers.findByIdFromTable('parcels', req.params.id);
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
    if (!req.user.admin) {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'You do not have access to this resource' });
      }
      next();
    }
    next();
  }
}
