export const users = [
  {
    id: 1,
    parcels: [1, 2, 3],
    fullName: 'User One',
  },
  {
    id: 2,
    parcels: [],
    fullName: 'User Two',
  },
];

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

export const Parcels = [
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
  {
    id: 4,
    destination: 'Ojota, Lagos',
    pickUpLocation: 'SendIT Pickup Station, Ojota',
    price: 'N500',
    status: statuses.InTransit,
    presentLocation: 'Ketu, Lagos',
  },
];

export const userHelpers = {
  findAll() {
    return users || [];
  },

  addUser(user) {
    users.push(user);
  },

  getUser(userId) {
    console.log(userId);
    return users.filter(items => items.id === userId)[0];
  },

  parcelsForUser(userId) {
    const user = userHelpers.getUser(userId);
    if (user === undefined || user === null) {
      throw new Error('User not found');
    }
    return user.parcels;
  },
};

export const parcelHelpers = {
  findAll() {
    return Parcels || [];
  },

  find(id) {
    return Parcels.filter(parcels => parcels.id === id)[0];
  },

  update(parcel) {
    const index = Parcels.indexOf(parcel);
    Parcels[index] = parcel;
  },

  addParcel(parcel) {
    Parcels.push(parcel);
  },

  retrieveParcels(parcelIds) {
    return Parcels.filter(parcel => parcelIds.indexOf(parcel.id) !== -1);
  },
};
