import User from '../models/userModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const userController = {
<<<<<<< HEAD
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
	getOneUser: async (req, res) => {
		try {
			const uid = req.user.uid;

			const user = await User.findOne({ _id: uid });

			res.status(200).json({ user });
		} catch (e) {
			console.log(e);
		}
	},
	updateUser: async (req, res) => {
		try {
			const { _id, username, firstName, lastName, email, password } =
				req.body;
=======
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
      const { _id, username, firstName, lastName, email, password } = req.body;
>>>>>>> 899c4572cc63d7d25b44b07dd938d8f37a5202dc

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
