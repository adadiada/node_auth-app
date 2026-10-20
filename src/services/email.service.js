import nodemailer from 'nodemailer';
import 'dotenv/config';
// import { MailtrapTransport } from 'mailtrap';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// const info = await transporter.sendMail({
//   from: process.env.SMTP_FROM,
//   to: 'fafat20198@moravita.com', // list of recipients
//   subject: 'Hello', // subject line
//   text: 'Hello world?', // plain text body
//   html: '<b>Hello world?</b>', // HTML body
// });

// const transport = nodemailer.createTransport(
//   MailtrapTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   }),
// );

// const sender = {
//   address: 'hello@demomailtrap.co',
//   name: 'Mailtrap Test',
// };
// const recipients = ['tt7313158@gmail.com'];

// transport
//   .sendMail({
//     from: sender,
//     to: recipients,
//     subject: 'You are awesome!',
//     text: 'Congrats for sending test email with Mailtrap!',
//     category: 'Integration Test',
//   })
//   .then(console.log, console.error);

export function send({ email, subject, html }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html,
  });
}

export function sendActivatationEmail(email, token) {
  const href = `${process.env.CLIENT_HOST}/activate/${token}`;
  const html = `
 <h1>Activate account</h1>
 <a href="${href}">${href}</a>
 `;

  return send({
    email,
    subject: 'Activate',
    html,
  });
}

export const emailService = {
  sendActivatationEmail,
};
