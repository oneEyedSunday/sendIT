/*
// import express from 'express';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
// import mailer from './mail';


// const mailRouter = express.Router();


mailRouter.post('/mail', async (req, res, next) => {
  const { recipient, message } = req.body;
  try {
    await mailer(recipient, message);
    res.json({ message: 'Your query has been sent' });
    await next();
  } catch (e) {
    await next(e);
  }
});


mailer('senditsandbox@mailinator.com, idiakosesunday@gmail.com', {
  subject: 'Testing Mailgun Mailing',
  text: 'Message text',
  html: `
    Your parcel delivery order has been created, it is awaiting processing<br />
    It is to be delivered to <strong>Ojota</strong>
    And picked up at <strong>Ojota Bus stop</strong>
  `
}).then(() => console.log('mail sent'))
  .catch((error) => {
    throw new Error(error);
  });

const options = {
  auth: {
    api_user: 'oneeyedsunday',
    api_key: '2018Onward$',
  },
};

const smtpConfig = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: true,
  auth: {
    user: '629073884f0200',
    pass: '8a740429e0ca30',
  },
};

const transporter = nodemailer.createTransport(smtpConfig);


transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const mailOptions = {
  from: '"Test Server" <test@example.com>',
  to: 'senditsandbox@mailinator.com',
  subject: 'Email Test',
  html: `
  <html>
    <body>
    Hello <b>firstname</b>, your parcel delivery order parcelId has been created,
    It is currently status.
    Click on this <a href="google.com" target="blank">link</a>
     anytime to see the details of the order
    </body>
  </html>
  `,
};

const client = nodemailer.createTransport(sgTransport(options));

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Info: ', info);
  console.log('Email successfully sent.');
});


client.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
});

// export default mailRouter;
*/

import mailHelper from './mail';

const message = {
  subject: 'Parcel Delivery Order Status',
  html: `
    Hello <b>firstname</b>, your parcel delivery order parcelId has been created, It is currently <em>status</em>.
    Click on this <a href="google.com" target="blank">link</a> anytime to see the details of the order.
    This is the link in case the above doesnt work
    https://hostedUrl/parcels/parceldis
    `,
};

// eslint-disable-next-line no-console
mailHelper('senditsandbox@mailinator.com', message, null).then(info => console.log(info)).catch(err => console.log(`An error occured ${err}`));
