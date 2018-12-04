import jwt from 'jsonwebtoken';
import DBHelpers from '../models/helpers';
import errors from '../helpers/errors';

const {
  authFailed, authRequired, invalidToken,
  accessDenied, serverError, resourceNotExists,
} = errors;

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
      return res.status(400).json({ error: 'You sent a badly form text, please ensure your text is parseable to JSON or just send JSON data.' });
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
        if (err) {
          return res.status(invalidToken.status)
            .json({ auth: false, message: invalidToken.message });
        }
        req.user = payload;
        next();
      });
    } else {
      return res.status(authFailed.status).json({
        auth: false,
        message: authRequired.message,
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
      return res.status(accessDenied.status).send({ error: accessDenied.message });
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
      if (parcel === undefined || parcel === null) {
        return res.status(resourceNotExists.status).json({ error: `Parcel delivery order ${resourceNotExists.message}` });
      }
      return next();
    } catch (error) {
      return res.status(serverError.status).json({ error: serverError.message });
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
      const condition = (req.parcel.userid === req.user.id);
      if (condition) return next();
      return res.status(accessDenied.status).send({ error: accessDenied.message });
    } catch (error) {
      return res.status(serverError.status).send({ error: serverError.message });
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
      if (req.user.id !== parseInt(req.params.id, 10)) {
        return res.status(accessDenied.status).json({ error: accessDenied.message });
      }
    }
    next();
  }
}
