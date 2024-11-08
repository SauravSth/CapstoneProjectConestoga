import Expense from '../models/expenseModel.js';
import errorHandler from '../helpers/errorHandler.js';

const expenseController = {
	getExpense: async (req, res) => {
		try {
			const { uid } = req.body;
			const expenses = await Expense.find({ user: uid }).populate(
				'category user'
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
				'category user'
			);

			res.status(200).json({ expense });
		} catch (e) {
			console.log(e);
		}
	},
	postExpense: async (req, res) => {
		try {
			const { title, date, amount, category_id, user_id, group_id } =
				req.body;
			console.log(req.body);
			let newExpense = await Expense.create({
				title,
				date,
				amount,
				category_id,
				user_id,
				group_id,
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
			const { _id, title, date, amount, category_id, user_id, group_id } =
				req.body;

			const updatedData = await Expense.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						date,
						amount,
						category_id,
						user_id,
						group_id,
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
