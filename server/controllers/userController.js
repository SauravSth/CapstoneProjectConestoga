import User from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const userController = {
	testRoute: async (req, res) => {
		res.send(req.user);
	},
	getUser: async (req, res) => {
		try {
			const users = await User.find({});

			res.status(200).json({ users });
		} catch (e) {
			console.log(e);
		}
	},
	getUserDetails: async (req, res) => {
		try {
			const { uid } = req.user;

			const user = await User.findOne({ _id: uid });

			res.status(200).json({ user });
		} catch (e) {
			console.log(e);
		}
	},
	getOneUser: async (req, res) => {
		try {
			const uid = req.params._id;

			const user = await User.findOne({ _id: uid });

			res.status(200).json({ user });
		} catch (e) {
			console.log(e);
		}
	},
	updateUser: async (req, res) => {
		try {
			const { username, firstName, lastName, email, password } = req.body;
			const { _id } = req.params;

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
