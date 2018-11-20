import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  auth: {
    api_key: process.env.SENDGRID_APIKEY,
  },
};

const client = nodemailer.createTransport(sgTransport(options));

const sendEmail = (recipient, message, attachment) => new Promise((resolve, reject) => {
  const data = {
    from: 'SendIT <info@ispoa-sendit.herokuapp.com>',
    to: recipient,
    subject: message.subject,
    text: message.text,
    inline: attachment,
    html: `
    <html>
      <body>
        ${message.html}
      </body>
    </html>
    `,
  };

  client.sendMail(data, (err, info) => {
    if (err) {
      reject(err);
    } else {
      resolve(info);
    }
  });
});

export default sendEmail;
