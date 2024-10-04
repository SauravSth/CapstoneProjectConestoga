import user from '../models/userModel.js';

const userController = {
	getUser: (req, res) => {
		res.send('User Page');
	},
	getUserLogin: (req, res) => {
		res.send('Login User GET');
	},
	getUserSignUp: (req, res) => {
		res.send('Sign Up User GET');
	},
	postUserLogin: (req, res) => {
		res.send('Login User POST');
	},
	postUserSignUp: (req, res) => {
		res.send('Sign Up User POST');
	},
};

export default userController;
