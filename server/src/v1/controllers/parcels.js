import Validator from '../helpers/validator';
import { parcelHelpers, statuses } from '../helpers/mockdb';

const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';


const ParcelsController = {
  index(req, res) {
    const parcels = parcelHelpers.findAll();
    return res.json(parcels);
  },

  get(req, res) {
    const parcelId = parseInt(req.params.id, 10);
    const parcel = parcelHelpers.find(parcelId);
    if (parcel === undefined || parcel === null) {
      return res.status(400).send({ error: 'Parcel delivery order not found.' });
    }
    return res.json(parcel);
  },

  cancel(req, res) {
    const parcelId = parseInt(req.params.id, 10);
    const parcel = parcelHelpers.find(parcelId);
    if (parcel === undefined || parcel === null) {
      return res.status(400).send({ error: 'Parcel delivery order not found.' });
    }

    if (parcel.status === statuses.Cancelled) {
      return res.status(409).send({ error: 'Parcel Delivery order already cancelled' });
    }
    const newParcel = {};
    Object.assign(newParcel, parcel, { status: statuses.Cancelled });
    delete newParcel.presentLocation;
    parcelHelpers.update(newParcel);
    return res.json(newParcel);
  },

  create(req, res) {
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
};

export default ParcelsController;
