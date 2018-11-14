import Validator from '../helpers/validator';
import { parcelHelpers, statuses, userHelpers } from '../helpers/mockdb';

const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';


const ParcelsController = {
  index(req, res) {
    const parcels = parcelHelpers.findAll();
    return res.json(parcels);
  },

  getOrder(req, res) {
    return res.json(req.parcel);
  },

  cancelOrder(req, res) {
    if (req.parcel.status === statuses.Cancelled) {
      return res.status(409).send({ error: 'Parcel Delivery order already cancelled' });
    }
    const newParcel = {};
    Object.assign(newParcel, req.parcel, { status: statuses.Cancelled });
    delete newParcel.presentLocation;
    parcelHelpers.update(newParcel);
    return res.json(newParcel);
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
    parcel.id = parcelHelpers.findAll().length + 1;
    parcel.price = defaultPrice;
    parcel.status = statuses.AwaitingProcessing;
    parcel.presentLocation = officeLocation;
    parcelHelpers.addParcel(parcel);
    return res.json(parcel);
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
    const newParcel = {};
    Object.assign(newParcel, req.parcel, { destination: req.body.destination, status: statuses.AwaitingProcessing });
    parcelHelpers.update(newParcel);
    return res.json(newParcel);
  },

  changeOrderStatus(req, res) {
    return res.end();
  }
};

export default ParcelsController;
