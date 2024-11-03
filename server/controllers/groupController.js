import Group from '../models/groupModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const groupController = {
	getGroup: async (req, res) => {
		try {
			const groups = await Group.find({});

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
			let newGroup = await Group.create({
				name,
				members,
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
};

export default groupController;
