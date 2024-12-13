import jwt from 'jsonwebtoken';

// Model Imports
import User from '../models/userModel.js';
import Group from '../models/groupModel.js';

// Controller Imports
import errorHandler from '../helpers/errorHandler.js';

// Helper Imports
import sendVerification from '../helpers/sendVerification.js';
import verificationCodeGenerator from '../helpers/verificationCodeGenerator.js';

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id, userType, email) => {
	return jwt.sign({ id, userType, email }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: MAX_AGE,
	});
};

const authController = {
	postUserLogin: async (req, res) => {
		try {
			const { email, password } = req.body;

			const userData = await User.login(email, password);

			if (!userData.isVerified) {
				return res.status(400).json({
					success: false,
					message: 'Please verify user before logging in.',
				});
			}
			if (!userData.isActive) {
				return res.status(400).json({
					success: false,
					message: 'Account has been deactivated.',
				});
			}

			const token = createToken(
				userData._id,
				userData.userType,
				userData.email
			);

			let successMessage =
				userData.userType === 'admin'
					? 'Admin Logged In'
					: 'User Logged In';

			res.cookie('jwt', token, {
				httpOnly: true,
				maxAge: MAX_AGE * 1000,
				secure: true,
				sameSite: 'none',
			})
				.status(200)
				.json({
					success: true,
					message: successMessage,
					user: userData,
				});
		} catch (e) {
			const errors = errorHandler.handleAuthErrors(e);
			res.status(400).json(errors);
		}
	},
	postUserSignUp: async (req, res) => {
		try {
			const { username, firstName, lastName, email, password } = req.body;
			const verificationCode = await verificationCodeGenerator();
			let newUser = await User.create({
				username,
				firstName,
				lastName,
				email,
				password,
				verificationCode,
			});
			sendVerification(email, verificationCode);
			res.status(200).json({
				success: true,
				message: 'User created successfully.',
				newUser,
			});
		} catch (e) {
			const errors = errorHandler.handleAuthErrors(e);
			res.status(400).json(errors);
		}
	},
	getUserLogout: (req, res) => {
		res.cookie('jwt', '', { maxAge: 1 });
		res.status(200).json({ success: true, message: 'Logged Out' });
	},
	verifyUser: async (req, res) => {
		try {
			const verificationCode = req.params.verificationCode;

			const user = await User.findOne({ verificationCode });

			if (user) {
				await user.updateOne({
					$set: {
						isVerified: true,
						isActive: true,
					},
				});
				res.status(200).json({
					success: true,
					message: 'Successfully verified',
				});
			} else {
				res.status(400).json({
					success: false,
					message: 'Could not find user',
				});
			}
		} catch (e) {
			console.log(e);
		}
	},
	registerFromInvite: async (req, res) => {
		try {
			const { username, firstName, lastName, email, password } = req.body;
			const { group_id } = req.params;
			let newUser = await User.create({
				username,
				firstName,
				lastName,
				email,
				password,
				isVerified: true,
				isActive: true,
			});

			const updateGroupData = await Group.findOneAndUpdate(
				{ _id: group_id, 'members.email': newUser.email },
				{
					$set: {
						'members.$.user_id': newUser._id,
						'members.$.invited': true,
					},
				},
				{ new: true }
			);
			if (updateGroupData) {
				res.status(200).json({
					success: true,
					message: 'User created successfully and added to group.',
					data: { user: newUser, group: updateGroupData },
				});
			} else {
				res.status(401).json({
					success: false,
					message: 'Something went wrong with creating the user.',
					data: { user: newUser, group: updateGroupData },
				});
			}
		} catch (e) {
			const errors = errorHandler.handleAuthErrors(e);
			res.status(400).json(errors);
		}
	},
};

export default authController;
