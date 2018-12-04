import DbHelpers from '../models/helpers';
import errors from '../helpers/errors';

const { findAllInTable, getParcelsByUserId } = DbHelpers;
const { serverError } = errors;

/**
 * Users controller - All functions for the handling user routes
 * @module controllers/users
 */
export default class UsersController {
  /**
 * index - Fetch all users
 *
 * @function getAllUsers
 * @memberof  module:controllers/users
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the users in system or an object containing error
 */
  static getAllUsers(req, res) {
    findAllInTable('users')
      .then(result => res.json(result))
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
  }

  /**
 * getParcels - Get all parcels
 *
 * @function getParcels
 * @memberof  module:controllers/users
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the parcels for a user or an object containing error
 */
  static getAUsersParcels(req, res) {
    getParcelsByUserId(req.params.id)
      .then(parcels => res.json(parcels))
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
  }
}
