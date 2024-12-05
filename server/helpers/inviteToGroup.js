import transporter from './mailHelper.js';
import axios from 'axios';

const addMemberToGroup = (email, groupDetails, hrefLink) => {};

const sendGroupInvite = async (
	email,
	groupDetails,
	senderData,
	isExistingUser
) => {
	try {
		let { firstName, lastName } = senderData;

		let hrefLink = isExistingUser
			? `http://localhost:5173/group/acceptedInvite/${email}/${groupDetails._id}`
			: `http://localhost:5173/registerFromInvite/${groupDetails._id}`;

		let inviteMessage = isExistingUser
			? `<h1>You have been invited to a ${groupDetails.name} by ${firstName} ${lastName}</h1>
		   Click Here to join the group.`
			: `You have been invited to join ${groupDetails.name} by ${firstName} ${lastName}.<br>
		   Looks like you are not registered. Register <a href="${hrefLink}">Here!</a>`;

		let mailInfo = {
			from: {
				name: 'PerCent Team',
				// address: process.env.SAURAV,
				address: 'piyush.mdhr@gmail.com',
			},
			to: email,
			subject: `Group Invitation`,
			html: inviteMessage,
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
					message: 'Group Invite Email Sent',
				});
				console.log('Group Invite email sent');
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export default sendGroupInvite;
