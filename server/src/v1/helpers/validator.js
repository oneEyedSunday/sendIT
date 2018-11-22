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
 * @returns {null} null
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
 * @returns {null} null
 */
  static checkBody(item, field) {
    if (!Object.prototype.hasOwnProperty.call(item, field) || item[field].length < 1) {
      const error = {};
      error.field = field;
      error.message = `${field} cannot be missing`;
      errors.push(error);
    }
  }


  /**
 * Function to trim strings in an object, targetted at request.body
 * @function
 * @param {object} object Object whose fields are to be trimmed
 * @return {object} req.body - returns trimmed request.body
 */
  static trimBody(object) {
    const fields = Object.keys(object);
    for (let i = 0; i < fields.length; i += 1) {
      if (typeof object[fields[i]] === 'string') {
        object[fields[i]] = object[fields[i]].trim().toLowerCase();
      }
    }
  }

  /**
 * Function to return errors
 * @function
 * @return {array} errors - returns the array of errors
 */
  static errors() {
    const err = errors;
    errors = [];
    return err;
  }
}
