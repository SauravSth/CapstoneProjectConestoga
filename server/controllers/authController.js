import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Model Imports
import User from '../models/userModel.js';

// Controller Imports
import errorController from '../helpers/errorHandler.js';

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id, userType) => {
	return jwt.sign({ id, userType }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: MAX_AGE,
	});
};

const authController = {
	getUserLogin: (req, res) => {
		try {
			res.json();
		} catch (e) {
			console.log('User login GET' + e);
		}
		res.send('Login User GET');
	},
	getUserSignUp: (req, res) => {
		res.send('Sign Up User GET');
	},
	postUserLogin: async (req, res) => {
		try {
			const { email, password } = req.body;

			const userData = await User.findOne({ email });

			if (!userData) {
				return res
					.status(404)
					.json({ success: false, message: 'User not found' });
			}
			bcrypt.compare(password, userData.password, (err, result) => {
				if (err) throw new Error('User Login POST bcrypt ' + e);

				if (result) {
					const token = createToken(userData._id, userData.userType);
					res.cookie('jwt', token, {
						httpOnly: true,
						maxAge: MAX_AGE * 1000,
					})
						.status(200)
						.json(userData);
				} else {
					res.status(400).json({
						success: false,
						message: 'Credentials did not match',
					});
				}
			});
		} catch (e) {
			console.log('User Login POST ' + e);
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
			// res.redirect('/login');
		} catch (e) {
			const errors = errorController.handleSignUpErrors(e);
			res.status(400).json(errors);
		}
	},
};

export default authController;
