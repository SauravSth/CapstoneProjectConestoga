import Goal from '../models/goalModel.js';

const goalController = {
	getGoal: async (req, res) => {
		try {
			const { uid } = req.user;
			const goals = await Goal.find({ user: uid }).populate(
				'user_id group_id'
			);

			res.status(200).json({ goals });
		} catch (e) {
			console.log(e);
		}
	},
	getOneGoal: async (req, res) => {
		try {
			const id = req.params._id;

			const goal = await Goal.findOne({ _id: id }).populate(
				'user_id group_id'
			);

			res.status(200).json({ goal });
		} catch (e) {
			console.log(e);
		}
	},
	postGoal: async (req, res) => {
		try {
			const { title, description, amount, group_id } = req.body;
			const { uid } = req.user;
			let newGoal = await Goal.create({
				title,
				amount,
				description,
				user_id: uid,
				group_id,
			});

			res.status(200).json({
				success: true,
				message: 'Goal created successfully.',
				newGoal,
			});
		} catch (e) {
			const errors = errorHandler.handleGoalErrors(e);
			res.status(400).json(errors);
		}
	},
	updateGoal: async (req, res) => {
		try {
			const { _id, title, description, amount, group_id } = req.body;

			const updatedData = await Goal.findOneAndUpdate(
				{ _id },
				{ $set: { title, description, amount, group_id } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Goal Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleGoalErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteGoal: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Goal.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Goal Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default goalController;
