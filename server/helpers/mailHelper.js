import nodemailer from 'nodemailer';

const sendMail = async (email, verificationCode) => {
	try {
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
		let mailInfo = {
			from: {
				name: 'PerCent Team',
				address: process.env.SAURAV,
			},
			to: email,
			subject: 'Verify your account at PerCent',
			html: `<h1>Welcome to the PerCent App</h1>
			Press <a href="http://localhost:3000/api/verify/${verificationCode}"}>Here</a> to verify your account.`,
		};
		transporter.sendMail(mailInfo, (err, res) => {
			if (err) {
				console.log('Could not send email' + err);
			} else {
				res.redirect('/');
				console.log('Mail Sent');
			}
		});
	} catch (e) {
		console.log(e);
	}
};

// sendMail(transporter, mailInfo);
export default sendMail;
