/* eslint-disable no-console */
import dotenv from 'dotenv';
import mailSender from './mail';

dotenv.config();
const baseURL = process.env.DATABASE_URL ? 'https://ispoa-sendit.herokuapp.com' : 'localhost:8080';
const UIURL = 'www.UIURL.com';
const URL = {
  api: baseURL,
  ui: UIURL
};

const getStatus = (code) => {
  switch (code) {
    case 0:
      return 'Awaiting Processing';
    case 1:
      return 'In Transit';
    case 2:
      return 'Delivered';
    case 4:
      return 'Cancelled';
    default:
      throw new Error('Invalid code');
  }
};

const updateUserWithStatus = (configObject) => {
  const { user, parcel, cancelled, } = configObject;
  let { existingParcel } = configObject;
  if (existingParcel === undefined || existingParcel === null) existingParcel = true;
  if (typeof parcel.status === 'string') parcel.status = parseInt(parcel.status, 10);
  const status = getStatus(parcel.status);
  let grammar = existingParcel ? 'updated' : 'created';
  grammar = cancelled ? 'cancelled' : grammar;
  const tellPrice = (grammar === 'created') ? parcel.price : null;
  const chargeText = tellPrice ? `You bill is ${parcel.price} <br>` : '';
  const message = {
    subject: 'Parcel Delivery Order Status Update',
    html: `
    Hello <b>${user.firstname}</b>, your parcel delivery order #${parcel.id} has been ${grammar},
    <br />
    It is now <em>${status}</em>.<br />
    ${chargeText}
    Click <a href="${URL.ui}/parcels/${parcel.id} target="blank">here</a> to see the details of the order.
    <br />This is the link in case the above isn't clickable. <br />
    ${URL.ui}/parcels/${parcel.id}
    `,
  };
  if (process.env.NODE_ENV.toLowerCase() !== 'test' && process.env.sendMails) {
    mailSender(user.email, message, null).then(info => console.log(info))
      .catch(error => console.error(error));
  }
};

export default updateUserWithStatus;
