import User from '../models/userModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const userController = {
	testRoute: async (req, res) => {
		res.send('Here');
	},
	getUser: async (req, res) => {
		try {
			const users = await User.find({});

			res.status(200).json({ users });
		} catch (e) {
			console.log(e);
		}
	},
	updateUser: async (req, res) => {
		try {
			const { _id, username, firstName, lastName, email, password } =
				req.body;

			const updatedData = await User.findOneAndUpdate(
				{ _id },
				{ $set: { username, firstName, lastName, email, password } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'User Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleUserErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteUser: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await User.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'User Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default userController;
