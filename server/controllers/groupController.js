import Group from '../models/groupModel.js';
import User from '../models/userModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';
import sendGroupInvite from '../helpers/inviteToGroup.js';

const groupController = {
	getGroup: async (req, res) => {
		try {
			const { uid } = req.user;
			const groups = await Group.find({ user_id: uid });

			res.status(200).json({ groups });
		} catch (e) {
			console.log(e);
		}
	},
	getOneGroup: async (req, res) => {
		try {
			const id = req.params._id;

			const group = await Group.findOne({ _id: id });

			res.status(200).json({ group });
		} catch (e) {
			console.log(e);
		}
	},
	postGroup: async (req, res) => {
		try {
			const { name, members } = req.body;
			const { uid } = req.user;
			let newGroup = await Group.create({
				name,
				members,
				user_id: uid,
			});

			res.status(200).json({
				success: true,
				message: 'Group created successfully.',
				newGroup,
			});
		} catch (e) {
			const errors = errorHandler.handleGroupErrors(e);
			res.status(400).json(errors);
		}
	},
	updateGroup: async (req, res) => {
		try {
			const { _id, name, members } = req.body;

			const updatedData = await Group.findOneAndUpdate(
				{ _id },
				{ $set: { name, members } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Group Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleGroupErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteGroup: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Group.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Group Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
	inviteToGroup: async (req, res) => {
		try {
			const { email, group_id } = req.body;

			const groupDetails = await Group.findOne({ _id: group_id }).select(
				'_id name'
			);
			const senderData = await User.findOne({ _id: req.user.uid });
			const isExistingUser = (await User.findOne({ email }))
				? true
				: false;

			await sendGroupInvite(
				email,
				groupDetails,
				senderData,
				isExistingUser
			);
		} catch (e) {
			console.log(e);
		}
	},
	acceptedInvite: async (req, res) => {
		try {
			const { email, groupId } = req.params;

			const userData = await User.findOne({ email });

			const updateGroupData = await Group.findOneAndUpdate(
				{ _id: groupId },
				{ $push: { members: userData._id, invited: true } },
				{ new: true }
			);

			if (updateGroupData) {
				res.status(200).json({
					success: true,
					message: 'Member added to group successfully',
				});
			} else {
				res.status(400).json({
					success: false,
					message: 'Something went wrong. Member not added',
				});
			}
		} catch (e) {
			console.log(e);
		}
	},
};

export default groupController;
