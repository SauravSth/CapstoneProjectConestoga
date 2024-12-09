import Budget from '../models/budgetModel.js';

const budgetController = {
	getBudget: async (req, res) => {
		try {
			const { uid } = req.user;
			const budgets = await Budget.find({ user_id: uid }).populate(
				'user_id'
			);

			res.status(200).json({ budgets });
		} catch (e) {
			console.log(e);
		}
	},
	getOneBudget: async (req, res) => {
		try {
			const id = req.params._id;

			const budget = await Budget.findOne({ _id: id }).populate(
				'user_id'
			);

			res.status(200).json({ budget });
		} catch (e) {
			console.log(e);
		}
	},
	postBudget: async (req, res) => {
		try {
			const { title, description, amount, group_id } = req.body;

			const { uid } = req.user;

			let newBudget = await Budget.create({
				title,
				description,
				amount,
				remainingAmount: amount,
				user_id: uid,
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
			const { title, description, amount } = req.body;
			const { _id } = req.params;
			const updatedData = await Budget.findOneAndUpdate(
				{ _id },
				{ $set: { title, description, amount } },
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
