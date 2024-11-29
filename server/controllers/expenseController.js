import Expense from '../models/expenseModel.js';
import Budget from '../models/budgetModel.js';
import Goal from '../models/goalModel.js';
import errorHandler from '../helpers/errorHandler.js';

const editBudgetAmount = async (amount, budget_id) => {
	let budget = await Budget.findOne({ _id: budget_id }).select(
		'amount remainingAmount'
	);
	let remainingBudget = (budget.remainingAmount || budget.amount) - amount;
	if (remainingBudget >= 0) {
		budget.remainingAmount = remainingBudget;
		await budget.save();
		return { success: true, remainingAmount: remainingBudget };
	} else {
		return { success: false, message: 'Insufficient budget' };
	}
};

const editGoalAmount = async (amount, goal_id) => {
	let goal = await Goal.findOne({ _id: goal_id }).select(
		'goalAmount savedAmount'
	);
	let totalSaved = goal + amount;
	if (totalSaved <= goal) {
		await goal.save({ savedAmount: totalSaved });
		return {
			success: true,
			message: 'Added successfully to your Goal',
		};
	} else {
		return {
			success: false,
			message: 'You have saved up to your set limit',
		};
	}
};

const expenseController = {
	getExpense: async (req, res) => {
		try {
			const { uid } = req.user;
			const { budget_id } = req.query;

			const filter = { user_id: uid };
			if (budget_id) {
				filter.budget_id = budget_id;
			}
			const expenses = await Expense.find(filter).populate(
				'category_id user_id budget_id'
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
				'category_id user_id budget_id'
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
				category_id,
				budget_id,
				goal_id,
			} = req.body;
			const { uid } = req.user;

			if (budget_id) {
				editBudgetAmount(amount, budget_id);
			} else if (goal_id) {
				editGoalAmount(amount, goal_id);
			}

			let newExpense = await Expense.create({
				title,
				date,
				amount,
				description,
				category_id,
				user_id: uid,
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
				category_id,
				budget_id,
				goal_id,
			} = req.body;

			if (budget_id) {
				editBudgetAmount(amount, budget_id);
			} else if (goal_id) {
				editGoalAmount(amount, goal_id);
			}

			const updatedData = await Expense.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						date,
						amount,
						description,
						category_id,
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
