import transporter from './mailHelper.js';

const sendGroupInvite = async (
	email,
	groupDetails,
	senderData,
	isExistingUser
) => {
	try {
		let { firstName, lastName } = senderData;

		let hrefLink = isExistingUser
			? `${process.env.FRONTEND_URL}/group/acceptedInvite/${email}/${groupDetails._id}`
			: `${process.env.FRONTEND_URL}/registerFromInvite/${groupDetails._id}`;

		let inviteMessage = isExistingUser
			? `
				<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
					<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
						<div style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
							<h1 style="margin: 0; font-size: 24px;">Group Invitation</h1>
						</div>
						<div style="padding: 20px; color: #333333; line-height: 1.6;">
							<p>Hi there,</p>
							<p>You have been invited to join the <strong>${groupDetails.name}</strong> group by <strong>${firstName} ${lastName}</strong>.</p>
							<p>Click the button below to accept the invitation:</p>
							<div style="text-align: center; margin: 20px 0;">
								<a href="${hrefLink}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">Join Group</a>
							</div>
							<p>We look forward to seeing you in the group!</p>
							<p>Best regards,</p>
							<p>The PerCent Team</p>
						</div>
						<div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666666;">
							<p>If you did not expect this email, you can ignore it.</p>
						</div>
					</div>
				</div>
			`
			: `
				<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
					<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
						<div style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
							<h1 style="margin: 0; font-size: 24px;">Group Invitation</h1>
						</div>
						<div style="padding: 20px; color: #333333; line-height: 1.6;">
							<p>Hi there,</p>
							<p>You have been invited to join the <strong>${groupDetails.name}</strong> group by <strong>${firstName} ${lastName}</strong>.</p>
							<p>It seems you are not registered yet. Click the button below to register and join the group:</p>
							<div style="text-align: center; margin: 20px 0;">
								<a href="${hrefLink}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">Register & Join Group</a>
							</div>
							<p>If the button above doesn’t work, you can use the link below:</p>
							<p><a href="${hrefLink}" style="color: #4caf50;">${hrefLink}</a></p>
							<p>We look forward to seeing you in the group!</p>
							<p>Best regards,</p>
							<p>The PerCent Team</p>
						</div>
						<div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666666;">
							<p>If you did not expect this email, you can ignore it.</p>
						</div>
					</div>
				</div>
			`;

		let mailInfo = {
			from: {
				name: 'PerCent Team',
				address: process.env.USER,
			},
			to: email,
			subject: `Group Invitation`,
			html: inviteMessage,
		};

		transporter.sendMail(mailInfo, (err, res) => {
			if (err) {
				console.log('Email not sent');
			} else {
				console.log('Group invite sent');
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export default sendGroupInvite;
