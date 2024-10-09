import jwt from 'jsonwebtoken';

// Model Imports
import User from '../models/userModel.js';

// Controller Imports
import errorController from './errorController.js';

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

			bcrypt.compare(password, userData.password, (err, result) => {
				if (err) throw new Error('User Login POST ' + e);
				if (result) {
					// Create JWT
				} else {
					return res.status(401).json({
						success: false,
						message: 'Incorrect details. Please try again.',
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
