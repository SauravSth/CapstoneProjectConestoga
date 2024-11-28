import Expense from '../models/expenseModel.js';
import Budget from '../models/budgetModel.js';
import errorHandler from '../helpers/errorHandler.js';

const editBudgetAmount = async (amount) => {
	let budgetAmount = await Budget.findOne({ budget_id }).select('amount');
	let remainingBudget = budgetAmount - amount;
	if (remainingBudget >= 0) {
		await Budget.save({ remainingAmount: remainingBudget });
		res.status(200).json({
			success: true,
			message: 'Added successfully to your budget',
		});
	} else {
		res.status(400).json({
			success: false,
			message: 'Budget limit has been exceeded',
		});
	}
};

const editGoalAmount = async (amount) => {
	let goalAmount = await Goal.findOne({ goal_id }).select('amount');
	let totalSaved = goalAmount + amount;
	if (totalSaved <= goalAmount) {
		await Budget.save({ amount: totalSaved });
		res.status(200).json({
			success: true,
			message: 'Added successfully to your Goal',
		});
	} else {
		res.status(400).json({
			success: false,
			message: 'You have saved up to your set limit',
		});
	}
};

const expenseController = {
	getExpense: async (req, res) => {
		try {
			const { uid } = req.user;
			const expenses = await Expense.find({ user_id: uid }).populate(
				'category_id user_id paid_by budget_id group_id'
			);

			res.status(200).json({ expenses });
		} catch (e) {
			console.log(e);
		}
	},
	getOneExpense: async (req, res) => {
		try {
			const id = req.params._id;

			const expense = await Expense.findOne({ _id: id }).populate(
				'category_id user_id paid_by budget_id group_id'
			);

			res.status(200).json({ expense });
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
				group_id,
				budget_id,
				goal_id,
			} = req.body;
			const { uid } = req.user;

			if (budget_id) {
				editBudgetAmount(amount);
			}
			if (goal_id) {
				editGoalAmount(amount);
			}

			let newExpense = await Expense.create({
				title,
				date,
				amount,
				description,
				paid_by,
				category_id,
				user_id: uid,
				group_id,
				budget_id,
				goal_id,
			});

			res.status(200).json({
				success: true,
				message: 'Expense added successfully.',
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
				group_id,
				budget_id,
				goal_id,
			} = req.body;

			if (budget_id) {
				editBudgetAmount(amount);
			}
			if (goal_id) {
				editGoalAmount(amount);
			}

			const updatedData = await Expense.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						date,
						amount,
						description,
						paid_by,
						category_id,
						group_id,
						budget_id,
						goal_id,
					},
				},
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Expense Updated',
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

			const deletedData = await Expense.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Expense Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default expenseController;
