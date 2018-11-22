/* eslint-disable no-console */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import dbHelper from '../../models';
import mailSender from './mail';

dotenv.config();
const baseURL = process.env.DATABASE_URL ? 'https://ispoa-sendit.herokuapp.com' : 'localhost:8080';

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

const updateUserWithStatus = (userId, parcel, existingParcel = true, cancelled = false) => {
  let user;
  if (typeof parcel.status === 'string') parcel.status = parseInt(parcel.status, 10);
  const status = getStatus(parcel.status);
  let grammar = existingParcel ? 'updated' : 'created';
  grammar = cancelled ? grammar === 'cancelled' : grammar;
  dbHelper.find('users', userId).then((result) => {
    user = result;
    jwt.sign(userId, process.env.secret, (err, decoded) => {
      const message = {
        subject: 'Parcel Delivery Order Status Update',
        html: `
        Hello <b>${user.firstname}</b>, your parcel delivery order #${parcel.id} has been ${grammar},
        <br />
        It is now <em>${status}</em>.<br />
        Click <a href="${baseURL}/api/v1/parcels/${parcel.id}?token=${decoded}" target="blank">here</a> to see the details of the order.
        <br />This is the link in case the above isn't clickable. <br />
        ${baseURL}/api/v1/parcels/${parcel.id}?token=${decoded}
        `,
      };
      // eslint-disable-next-line no-console
      console.log(message.html);
      mailSender(user.email, message, null).then(info => console.log(info))
        .catch(error => console.error(error));
    });
  });
};

export default updateUserWithStatus;
