import dbHelpers from '../models/helpers';

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
    dbHelpers.findAll('users')
      .then(result => res.json(result))
      .catch(error => res.status(400).json({ error: error.message }));
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
    if (!req.user.admin && (req.user.id !== req.params.id)) {
      return res.status(403).json({ error: 'You do not have access to this resource' });
    }
    dbHelpers.getParcelsByUserId(req.params.id)
      .then(parcels => res.json(parcels))
      .catch(error => res.status(400).json({ error: error.message }));
  }
}
