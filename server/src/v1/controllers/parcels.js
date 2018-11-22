import Validator from '../helpers/validator';
import { statuses } from '../helpers/mockdb';
import dbHelpers from '../helpers/db/helpers';

const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';

/**
 * Parcels controller - All functions for the handling parcel routes
 * @module controllers/users
 */
const ParcelsController = {
  /**
 * index - Fetch all parcels
 *
 * @function index
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {array} Returns array of parcels
 */
  getAllOrders(req, res) {
    dbHelpers.findAll('parcels')
      .then(result => res.json(result))
      .catch(error => res.status(400).json(error));
  },


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
  getOrder(req, res) {
    dbHelpers.find('parcels', req.params.id)
      .then(result => res.json(result))
      .catch(err => res.status(400).json(err));
  },

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
  cancelOrder(req, res) {
    if (req.parcel.status === statuses.Cancelled) {
      return res.status(409).send({ error: 'Parcel Delivery order already cancelled' });
    }
    dbHelpers.updateSingleField('parcels', req.params.id, { status: 4 })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },

  /**
 * createOrder - create a parcel delivery order
 *
 * @function createOrder
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the created parcel or an object containing error
 */
  createOrder(req, res) {
    const { parcel } = req.body;
    Validator.check(parcel, ['destination', 'pickUpLocation']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    // parcel.id = parcelHelpers.findAll().length + 1;
    dbHelpers.createParcel({
      userId: req.user.id,
      destination: parcel.destination,
      presentLocation: officeLocation,
      pickUpLocation: parcel.pickUpLocation,
      status: statuses.AwaitingProcessing.code,
      price: defaultPrice,
    }).then(createdParcel => res.json(createdParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },

  /**
 * changeOrderDestination - Change destination of parcel delivery order
 *
 * @function changeOrderDestination
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  changeOrderDestination(req, res) {
    Validator.check(req.body, ['destination']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    dbHelpers.updateSingleField('parcels', req.params.id, { destination: req.body.destination })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },

  /**
 * updateOrderStatus - Update status of parcel delivery order
 *
 * @function updateOrderStatus
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  updateOrderStatus(req, res) {
    Validator.check(req.body, ['status']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    dbHelpers.updateSingleField('parcels', req.params.id, { status: req.body.status })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },

  /**
 * updateOrderLocation - update present location of parcel delivery order
 *
 * @function updateOrderLocation
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @return {object} Returns the updated parcel or an object containing error
 */
  updateOrderLocation(req, res) {
    Validator.check(req.body, ['presentLocation']);
    const errors = Validator.errors();
    if (errors.length > 0) {
      return res.status(422).send({
        message: 'Validation errors',
        errors,
      });
    }
    dbHelpers.updateSingleField('parcels', req.params.id, { presentLocation: req.body.presentLocation })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },
};

export default ParcelsController;
