import Validator from '../helpers/validator';

/** Class representing Middleware functions. */
export default class ValidationMiddleware {
/**
 * Middleware to ensure appropriate values in request body
 * for signin up
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static signUpValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['email', 'password', 'firstname', 'lastname']);
    const errors = Validator.errors();
    if (req.body.email && req.body.email.length > 125) {
      errors.push({
        field: 'email',
        message: 'Email shouldnot exceed 125 characters in length'
      });
    }
    if (req.body.firstname && req.body.firstname.length > 20) {
      errors.push({
        field: 'firstname',
        message: 'Firstname shouldnot exceed 20 characters in length'
      });
    }
    if (req.body.lastname && req.body.lastname.length > 20) {
      errors.push({
        field: 'lastname',
        message: 'Lastname shouldnot exceed 20 characters in length'
      });
    }
    if (req.body.password && req.body.password.length > 70) {
      errors.push({
        field: 'password',
        message: 'There is a problem with your password. Please try another one.'
      });
    }
    const isEmail = /\S+@\S+\.\S+/.test(req.body.email);
    if (!isEmail) errors.push({ field: 'email', message: 'Email is Invalid' });
    if (req.body.password && req.body.password.trim().length < 6) errors.push({ field: 'password', message: 'Password length must be more than six characters' });
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }

  /**
 * Middleware to ensure appropriate values in request body for logging in
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static logInValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['email', 'password']);
    const errors = Validator.errors();
    const isEmail = /\S+@\S+\.\S+/.test(req.body.email);
    if (!isEmail) errors.push({ field: 'email', message: 'Email is Invalid' });
    if (req.body.password && req.body.password.trim().length < 6) errors.push({ field: 'password', message: 'Password length must be more than six characters' });
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }

  /**
 * Middleware to ensure correct values in request body for creating parcel
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static parcelCreationValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['destination', 'pickUpLocation']);
    const errors = Validator.errors();
    if (req.body.destination && req.body.destination.length > 125) {
      errors.push({
        field: 'destination',
        message: 'Destination shouldnot exceed 125 characters in length'
      });
    }
    if (req.body.pickUpLocation && req.body.pickUpLocation.length > 125) {
      errors.push({
        field: 'pickUpLocation',
        message: 'pickUpLocation shouldnot exceed 125 characters in length'
      });
    }
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }

  /**
 * Middleware to ensure correct values in request body for updating parcel destination
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static parcelDestinationUpdateValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['destination']);
    const errors = Validator.errors();
    if (req.body.destination && req.body.destination.length > 125) {
      errors.push({
        field: 'destination',
        message: 'Destination shouldnot exceed 125 characters in length'
      });
    }
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }

  /**
 * Middleware to ensure correct values for updating parcel status
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static parcelStatusUpdateValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['status']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }

  /**
 * Middleware to ensure correct values for updating parcel location
 * @module Middlewares
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
  static parcelLocationUpdateValidation(req, res, next) {
    Validator.trimBody(req.body);
    Validator.check(req.body, ['presentLocation']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    next();
  }
}
