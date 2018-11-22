import Validator from '../helpers/validator';
import { statuses } from '../helpers/mockdb';
import DbHelpers from '../models/helpers';

const {
  findAllInTable, findByIdFromTable, updateSingleFieldInTable, createParcel
} = DbHelpers;
const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';

/**
 * Parcels controller - All functions for the handling parcel routes
 * @module controllers/users
 */
export default class ParcelsController {
  /**
 * index - Fetch all parcels
 *
 * @function index
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object

 * @returns {array} Returns array of parcels
 */
  static getAllOrders(req, res) {
    findAllInTable('parcels')
      .then(result => res.json(result))
      .catch(error => res.status(400).json(error));
  }

  /**
 * getOrder - Fetch a parcel delivery order
 *
 * @function getOrder
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {null} order
 * @throws {error} error
 */
  static getOrder(req, res) {
    findByIdFromTable('parcels', req.params.id)
      .then(result => res.json(result))
      .catch(err => res.status(400).json(err));
  }

  /**
 * cancelOrder - Cancel a parcel delivery order
 *
 * @function cancelOrder
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {object} returns the updated Order
 * @throws {objecr} Throws an object containing the Error
 */
  static cancelOrder(req, res) {
    if (req.parcel.status === statuses.Cancelled) {
      return res.status(409).send({ error: 'Parcel Delivery order already cancelled' });
    }
    updateSingleFieldInTable('parcels', req.params.id, { status: 4 })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  }

  /**
 * createOrder - create a parcel delivery order
 *
 * @function createOrder
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the created parcel or an object containing error
 */
  static createOrder(req, res) {
    Validator.check(req.body, ['destination', 'pickUpLocation']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    createParcel({
      userId: req.user.id,
      destination: req.body.destination,
      presentLocation: officeLocation,
      pickUpLocation: req.body.pickUpLocation,
      status: statuses.AwaitingProcessing.code,
      price: defaultPrice,
    }).then(createdParcel => res.json(createdParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  }

  /**
 * changeOrderDestination - Change destination of parcel delivery order
 *
 * @function changeOrderDestination
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  static changeOrderDestination(req, res) {
    Validator.check(req.body, ['destination']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    updateSingleFieldInTable('parcels', req.params.id, { destination: req.body.destination })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  }

  /**
 * updateOrderStatus - Update status of parcel delivery order
 *
 * @function updateOrderStatus
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  static updateOrderStatus(req, res) {
    Validator.check(req.body, ['status']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    updateSingleFieldInTable('parcels', req.params.id, { status: req.body.status })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  }

  /**
 * updateOrderLocation - update present location of parcel delivery order
 *
 * @function updateOrderLocation
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  static updateOrderLocation(req, res) {
    Validator.check(req.body, ['presentLocation']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    updateSingleFieldInTable('parcels', req.params.id, { presentLocation: req.body.presentLocation })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  }
}
