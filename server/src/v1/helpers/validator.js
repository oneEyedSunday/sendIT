let errors = [];

/**
 * Helper Class containing validation functions
 * @type {object}
 * @const
 * @namespace Validator
 */
export default class Validator {
  /**
 * Function to validate an object
 * @function
 * @param {object} item - Item to run checks on
 * @param {object} options - Object containing validation options
 */
  static check(item, options) {
    if (Array.isArray(options)) {
      options.map(option => Validator.checkBody(item, option));
    }
  }

  /**
 * Function to run checks
 * @function
 * @param {object} item - Object to run check on
 * @param {string} field - field to check on
 */
  static checkBody(item, field) {
    if (!Object.prototype.hasOwnProperty.call(item, field)) {
      const error = {};
      error.field = field;
      error.message = `${field} cannot be missing`;
      errors.push(error);
    }
  }

  /**
 * Function to return errors
 * @function
 * @return {array}
 */
  static errors() {
    const err = errors;
    errors = [];
    return err;
  }
}
