import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import dbHelper from '../../models';

dotenv.config();
// change baseURl to UI not API url
// get a better testing condition
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
  // code should be integer
  const status = getStatus(parcel.status);
  let grammar = existingParcel ? 'updated' : 'created';
  grammar = cancelled ? grammar === 'cancelled' : grammar;
  // fiind user infor from userId
  dbHelper.find('users', userId).then((result) => {
    user = result;
    // console.log(user);
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
      // save rates
      // eslint-disable-next-line no-console
      console.log(message.html);
      // mailSender(user.email, message, null).then(info => console.log(info))
      // .catch(error => console.error(error));
    });
  });
};

export default updateUserWithStatus;
