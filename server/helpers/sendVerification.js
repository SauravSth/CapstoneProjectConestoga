import transporter from './mailHelper.js';

const sendVerification = async (email, verificationCode) => {
	try {
		let mailInfo = {
			from: {
				name: 'PerCent Team',
				address: 'piyush.mdhr@gmail.com',
			},
			to: email,
			subject: 'Verify your account at PerCent',
			html: `<h1>Welcome to the PerCent App</h1>
			Press <a href="http://localhost:5173/verify/${verificationCode}" style="color: red">Here</a> to verify your account.`,
		};

		transporter.sendMail(mailInfo, (err, res) => {
			if (err) {
				res.status(400).json({
					success: false,
					message: 'Email not sent',
				});
				console.log('Could not send email: ' + err);
			} else {
				res.status(200).json({
					success: true,
					message: 'Verification Email Sent',
				});
				console.log('Verification email sent');
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export default sendVerification;
