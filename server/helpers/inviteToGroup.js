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
			? `http://localhost:3000/api/group/acceptedInvite/${email}/${groupDetails._id}`
			: `http://localhost:5173/registerFromInvite/${groupDetails._id}`;

		let inviteMessage = isExistingUser
			? `<h1>You have been invited to a ${groupDetails.name} by ${firstName} ${lastName}</h1>
       <form action="${hrefLink}" method="POST" style="display:inline;">
           <button type="submit" style="color: red; background:none; border:none; cursor:pointer;">Here</button>
       </form> to join the group.`
			: `You have been invited to join ${groupDetails.name} by ${firstName} ${lastName}.<br>
       Looks like you are not registered. Register 
       <form action="${hrefLink}" method="POST" style="display:inline;">
           <button type="submit" style="color: red; background:none; border:none; cursor:pointer;">Here</button>
       </form>.`;

		let mailInfo = {
			from: {
				name: 'PerCent Team',
				address: process.env.SAURAV,
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
