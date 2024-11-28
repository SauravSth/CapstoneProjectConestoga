import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.SAURAV,
		pass: process.env.SAURAV_PASSWORD,
	},
});

export default transporter;
