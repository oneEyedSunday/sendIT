import statuses from '../helpers/statuses';
import DbHelpers from '../models/helpers';
import errors from '../helpers/errors';
import notifyByMail from '../helpers/mail/update';

const {
  findAllInTable, findByIdFromTable, updateSingleFieldInTable, createParcel
} = DbHelpers;
const { serverError, resourceConflict, validationErrors } = errors;
const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';

const INVALIDWEIGHTERRORMESSAGE = 'Weight specified is invalid, cannot bill.';
const getPriceFromWeightRange = (weight) => {
  if (weight > -1 && weight < 51) return defaultPrice;
  if (weight > 50 && weight < 101) return 'N1000';
  if (weight > 100 && weight < 201) return 'N3000';
  if (weight > 200) return 'N5000';
  throw new Error(INVALIDWEIGHTERRORMESSAGE);
};

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
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
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
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
  }

  /**
 * cancelOrder - Cancel a parcel delivery order
 *
 * @function cancelOrder
 * @memberof  module:controllers/parcels
 * @param  {Object} req  Express request object
 * @param  {Object} res  Express response object
 * @returns {object} returns the updated Order
 * @throws {object} Throws an object containing the Error
 */
  static cancelOrder(req, res) {
    if (req.parcel.status === statuses.Cancelled.code) {
      return res.status(resourceConflict.status).send({ error: 'Parcel Delivery order already cancelled' });
    }
    updateSingleFieldInTable('parcels', req.params.id, { status: statuses.Cancelled.code })
      .then((updatedParcel) => {
        notifyByMail({
          user: req.user,
          parcel: updatedParcel,
          cancelled: true
        });
        res.json(updatedParcel);
      })
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
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
    let weight;
    if (typeof req.body.weight === 'string') {
      const convertedWeight = parseInt(req.body.weight, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(convertedWeight)) {
        weight = 30;
      } else {
        weight = convertedWeight;
      }
    } else if (typeof req.body.weight === 'number') {
      // eslint-disable-next-line prefer-destructuring
      weight = req.body.weight;
    } else {
      weight = (req.body.weight ? -1 : 30);
    }

    try {
      const price = getPriceFromWeightRange(weight);
      createParcel({
        userId: req.user.id,
        destination: req.body.destination,
        presentLocation: officeLocation,
        pickUpLocation: req.body.pickUpLocation,
        weight,
        status: statuses.AwaitingProcessing.code,
        price,
      }).then((createdParcel) => {
        notifyByMail({
          user: req.user,
          parcel: createdParcel,
          existingParcel: false
        });
        return res.json(createdParcel);
      })
        .catch(() => res.status(serverError.status).json({ error: serverError.message }));
    } catch (error) {
      if (error.message === INVALIDWEIGHTERRORMESSAGE) {
        return res.status(validationErrors.status).json({
          message: validationErrors.message,
          errors: {
            field: 'weight',
            message: INVALIDWEIGHTERRORMESSAGE
          }
        });
      }
      return res.status(serverError.status).json({ error: serverError.message });
    }
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
    updateSingleFieldInTable('parcels', req.params.id, { destination: req.body.destination })
      .then((updatedParcel) => {
        notifyByMail({
          user: req.user,
          parcel: updatedParcel,
        });
        return res.json(updatedParcel);
      })
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
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
    updateSingleFieldInTable('parcels', req.params.id, { status: req.body.status })
      .then((updatedParcel) => {
        notifyByMail({
          user: req.user,
          parcel: updatedParcel
        });
        return res.json(updatedParcel);
      })
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
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
    updateSingleFieldInTable('parcels', req.params.id, { presentLocation: req.body.presentLocation })
      .then((updatedParcel) => {
        notifyByMail({
          user: req.user,
          parcel: updatedParcel
        });
        return res.json(updatedParcel);
      })
      .catch(() => res.status(serverError.status).json({ error: serverError.message }));
  }
}
