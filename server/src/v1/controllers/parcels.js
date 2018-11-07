export const statuses = {
  AwaitingProcessing: {
    code: 0,
    uiText: 'Awaiting Processing',
  },
  InTransit: {
    code: 1,
    uiText: 'In Transit',
  },
  Delivered: {
    code: 2,
    uiText: 'Parcel Delivered',
  },
  Cancelled: {
    code: 4,
    uiText: 'Parcel Delivery Cancelled',
  },
};

const officeLocation = 'Maryland, Lagos';
const defaultPrice = 'N500';

const Parcels = [
  {
    id: 1,
    destination: 'Ojota, Lagos',
    pickUpLocation: 'SendIT Pickup Station, Ojota',
    price: 'N500',
    status: statuses.InTransit,
    presentLocation: 'Ketu, Lagos',
  },
  {
    id: 2,
    destination: 'Ikeja, Lagos',
    pickUpLocation: 'SendIT Pickup Station, Ikeja',
    price: 'N700',
    status: statuses.Delivered,
  },
  {
    id: 3,
    destination: 'Maitama, Abuja',
    pickUpLocation: 'SendIT Pickup Station, Wuse',
    price: 'N5000',
    status: statuses.Cancelled,
  },
];

const ParcelsController = {
  findAll() {
    return Parcels;
  },

  find(id) {
    return Parcels.filter(parcels => parcels.id === id)[0];
  },

  retrieveParcels(parcelIds) {
    return Parcels.filter(parcel => parcelIds.indexOf(parcel.id) !== -1);
  },

  index(req, res) {
    const parcels = ParcelsController.findAll();
    return res.json(parcels);
  },

  get(req, res) {
    const parcelId = parseInt(req.params.id, 10);
    const parcels = ParcelsController.find(parcelId);
    return res.json(parcels);
  },

  cancel(req, res) {
    const parcelId = parseInt(req.params.id, 10);
    const parcel = ParcelsController.find(parcelId);
    const newParcel = {};
    Object.assign(newParcel, parcel, { status: statuses.Cancelled });
    delete newParcel.presentLocation;
    const index = Parcels.indexOf(parcel);
    Parcels[index] = newParcel;
    return res.json(newParcel);
  },

  create(req, res) {
    const { parcel } = req.body;
    parcel.id = Parcels.length + 1;
    parcel.price = defaultPrice;
    parcel.status = statuses.AwaitingProcessing;
    parcel.presentLocation = officeLocation;
    Parcels.push(parcel);
    res.json(parcel);
  },
};

export default ParcelsController;
