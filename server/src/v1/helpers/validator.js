let errors = [];

export default class Validator {
  static check(item, options) {
    if (Array.isArray(options)) {
      options.map(option => Validator.checkBody(item, option));
    }
  }

  static checkBody(item, field) {
    if (!Object.prototype.hasOwnProperty.call(item, field)) {
      const error = {};
      error.field = field;
      error.message = `${field} cannot be missing`;
      errors.push(error);
    }
  }

  static sanitize(item) {
    return item.trim();
  }

  static errors() {
    const err = errors;
    errors = [];
    return err;
  }
}
