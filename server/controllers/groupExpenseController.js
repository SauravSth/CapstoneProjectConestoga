import GroupExpense from '../models/groupExpenseModel.js';
import Budget from '../models/budgetModel.js';
import errorHandler from '../helpers/errorHandler.js';

const editBudgetAmount = async (amount) => {
	let budgetAmount = await Budget.findOne({ budget_id }).select('amount');
	let remainingBudget = budgetAmount - amount;
	if (remainingBudget > 0) {
		await Budget.save({ remainingAmount: remainingBudget });
	} else {
		res.status(400).json({
			success: false,
			message: 'Budget limit has been exceeded',
		});
	}
};

const groupExpenseController = {
	getExpense: async (req, res) => {
		try {
			const { uid } = req.user;
			const groupExpenses = await GroupExpense.find({
				user_id: uid,
			}).populate('category_id user_id paid_by budget_id group_id');

			res.status(200).json({ groupExpenses });
		} catch (e) {
			console.log(e);
		}
	},
	getOneExpense: async (req, res) => {
		try {
			const id = req.params._id;

			const groupExpense = await GroupExpense.findOne({
				_id: id,
			}).populate('category_id user_id paid_by budget_id group_id');

			res.status(200).json({ groupExpense });
		} catch (e) {
			console.log(e);
		}
	},
	postExpense: async (req, res) => {
		try {
			let {
				title,
				date,
				amount,
				description,
				paid_by,
				category_id,
				user_id,
				group_id,
				budget_id,
			} = req.body;

			paid_by = !group_id ? user_id : paid_by;

			if (budget_id) {
				editBudgetAmount(amount);
			}

			let newExpense = await GroupExpense.create({
				title,
				date,
				amount,
				description,
				paid_by,
				category_id,
				user_id,
				group_id,
				budget_id,
			});

			res.status(200).json({
				success: true,
				message: 'GroupExpense added successfully.',
				newExpense,
			});
		} catch (e) {
			const errors = errorHandler.handleExpenseErrors(e);
			res.status(400).json(errors);
		}
	},
	updateExpense: async (req, res) => {
		try {
			let {
				_id,
				title,
				date,
				amount,
				description,
				paid_by,
				category_id,
				user_id,
				group_id,
				budget_id,
			} = req.body;

			paid_by = !group_id ? user_id : paid_by;

			if (budget_id) {
				editBudgetAmount(amount);
			}

			const updatedData = await GroupExpense.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						date,
						amount,
						description,
						paid_by,
						category_id,
						user_id,
						group_id,
						budget_id,
					},
				},
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'GroupExpense Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleExpenseErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteExpense: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await GroupExpense.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'GroupExpense Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default groupExpenseController;
