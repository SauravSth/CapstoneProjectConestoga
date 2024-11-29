import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'piyush.mdhr@gmail.com',
    pass: 'fotb jgij swsq tcsn',
  },
});

export default transporter;
