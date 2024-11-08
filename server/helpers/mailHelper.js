import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
		user: 'percent.capstone@gmail.com',
		pass: 'zbhw ntwu ytib wwkm',
	},
});

const mailInfo = await transporter.sendMail({
	from: {
		name: 'PerCent Team',
		address: 'percent.capstone@gmail.com',
	},
	to: 'percent.test@yopmail.com',
	subject: 'Hello from the PerCent Team',
	text: 'Hi! This is the PerCent Team',
	html: '<h1>Welcome to the PerCent App</h1>',
});

const sendMail = async (transporter, mailInfo) => {
	try {
		await transporter.sendMail(mailInfo);
		console.log('Mail Sent');
	} catch (e) {
		console.log(e);
	}
};

sendMail(transporter, mailInfo);
// zbhw ntwu ytib wwkm (App Password)
