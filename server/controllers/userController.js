import user from '../models/userModel.js';

const userController = {
	getUser: (req, res) => {
		res.send('User Page');
	},
};

export default userController;
