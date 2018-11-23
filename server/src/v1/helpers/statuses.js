const statuses = {
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

export default statuses;
