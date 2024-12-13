import transporter from './mailHelper.js';

const sendVerification = async (email, verificationCode) => {
	try {
		let mailInfo = {
			from: {
				name: 'PerCent Team',
				address: process.env.USER,
			},
			to: email,
			subject: 'Verify your account at PerCent',
			html: `
			<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
			<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
				<div style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
				<h1 style="margin: 0; font-size: 24px;">Welcome to PerCent</h1>
				</div>
				<div style="padding: 20px; color: #333333; line-height: 1.6;">
				<p>Hi there,</p>
				<p>Thank you for signing up with PerCent. We’re excited to have you on board!</p>
				<p>To complete your registration, please verify your email address by clicking the button below:</p>
				<div style="text-align: center; margin: 20px 0;">
				<a href="http://localhost:5173/verify/${verificationCode}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Your Account</a>
				</div>
				
				<p>If you did not sign up for PerCent, please ignore this email or contact our support team.</p>
				<p>Best regards,</p>
				<p>The PerCent Team</p>
				</div>
				<div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666666;">
				<p>You are receiving this email because you recently signed up for PerCent. If you did not sign up, please ignore this email.</p>
				</div>
			</div>
			</div>
      		`,
		};

		transporter.sendMail(mailInfo, (err, res) => {
			if (err) {
				console.log('Email not sent', err);
			} else {
				console.log('Email Sent');
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export default sendVerification;
