import Validator from '../helpers/validator';
import { statuses } from '../helpers/mockdb';
import dbHelpers from '../helpers/db/helpers';

const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';


const ParcelsController = {
  index(req, res) {
    dbHelpers.findAll('parcels')
      .then(result => res.json(result))
      .catch(error => res.status(400).json(error));
  },

  getOrder(req, res) {
    dbHelpers.find('parcels', req.params.id)
      .then(result => res.json(result))
      .catch(err => res.status(400).json(err));
  },

  cancelOrder(req, res) {
    if (req.parcel.status === statuses.Cancelled) {
      return res.status(409).send({ error: 'Parcel Delivery order already cancelled' });
    }
    dbHelpers.updateSingleField('parcels', req.params.id, { status: 4 })
      .then(updatedParcel => res.json(updatedParcel))
      .catch(error => res.status(400).json({ error: error.message }));
  },

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
