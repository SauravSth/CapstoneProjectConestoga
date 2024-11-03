import jwt from 'jsonwebtoken';

// Model Imports
import User from '../models/userModel.js';

// Controller Imports
import errorHandler from '../helpers/errorHandler.js';

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id, userType) => {
	return jwt.sign({ id, userType }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: MAX_AGE,
	});
};

const authController = {
	postUserLogin: async (req, res) => {
		try {
			const { email, password } = req.body;

			const userData = await User.login(email, password);

			const token = createToken(userData._id, userData.userType);
			res.cookie('jwt', token, {
				httpOnly: true,
				maxAge: MAX_AGE * 1000,
				secure: true,
				sameSite: 'none',
			})
				.status(200)
				.json(userData._id);
		} catch (e) {
			const errors = errorHandler.handleAuthErrors(e);
			res.status(400).json(errors);
		}
	},
	postUserSignUp: async (req, res) => {
		try {
			const { username, firstName, lastName, email, password } = req.body;
			let newUser = await User.create({
				username,
				firstName,
				lastName,
				email,
				password,
			});

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
};

export default authController;
