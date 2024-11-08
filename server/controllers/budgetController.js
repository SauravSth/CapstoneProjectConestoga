import Budget from '../models/budgetModel.js';

const budgetController = {
	getBudget: async (req, res) => {
		try {
			const budgets = await Budget.find({}).populate('user group');

			res.status(200).json({ budgets });
		} catch (e) {
			console.log(e);
		}
	},
	getOneBudget: async (req, res) => {
		try {
			const id = req.params._id;

			const budget = await Budget.findOne({ _id: id }).populate(
				'user group'
			);

			res.status(200).json({ budget });
		} catch (e) {
			console.log(e);
		}
	},
	postBudget: async (req, res) => {
		try {
			const { title, upperLimit, lowerLimit, user_id, group_id } =
				req.body;
			let newBudget = await Budget.create({
				title,
				upperLimit,
				lowerLimit,
				user_id,
				group_id,
			});

			res.status(200).json({
				success: true,
				message: 'Budget created successfully.',
				newBudget,
			});
		} catch (e) {
			const errors = errorHandler.handleBudgetErrors(e);
			res.status(400).json(errors);
		}
	},
	updateBudget: async (req, res) => {
		try {
			const { _id, title, upperLimit, lowerLimit, user_id, group_id } =
				req.body;

			const updatedData = await Budget.findOneAndUpdate(
				{ _id },
				{ $set: { title, upperLimit, lowerLimit, user_id, group_id } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Budget Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleBudgetErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteBudget: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Budget.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Budget Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default budgetController;
