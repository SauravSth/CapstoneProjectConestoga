import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.USER,
		pass: process.env.APP_PASSWORD,
	},
});

export default transporter;
