import bcrypt from 'bcrypt-nodejs';

/**
 * Helper Class containing functions for Authentication.
 * @type {object}
 * @const
 * @namespace AuthHelper
 */
export default class AuthHelper {
  /**
   * Function to wrap around hashing
 * @function
 * @param {string} plain - String to be hashed
 * @return {Promise} Promise to resolve or reject
 */
  static hash(plain) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plain, null, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  /**
   * Function to wrap around comparison
 * @function
 * @param {string} plain - String to compare with hash
 * @param {string} hash - Hash to compare with
 * @return {Promise} Promise to reject or resolve
 */
  static compare(plain, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plain, hash, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
