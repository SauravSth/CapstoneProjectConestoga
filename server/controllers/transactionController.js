import Transaction from '../models/transactionModel.js';
import errorHandler from '../helpers/errorHandler.js';
import Expense from '../models/expenseModel.js';

const transactionController = {
	getTransaction: async (req, res) => {
		try {
			const { uid } = req.user;
			const transactions = await Transaction.find({ user: uid }).populate(
				[
					{ path: 'payer' },
					{ path: 'receiver' },
					{ path: 'expense_id', select: 'amount' },
				]
			);

			res.status(200).json({ transactions });
		} catch (e) {
			console.log(e);
		}
	},
	getOneTransaction: async (req, res) => {
		try {
			const id = req.params._id;

			const transaction = await Transaction.findOne({ _id: id }).populate(
				[
					{ path: 'payer' },
					{ path: 'receiver' },
					{ path: 'expense_id', select: 'amount' },
				]
			);

			res.status(200).json({ transaction });
		} catch (e) {
			console.log(e);
		}
	},
	postTransaction: async (req, res) => {
		try {
			let {
				title,
				payer,
				receiver,
				paidAmount,
				expense_id,
				date,
				user_id,
				group_id,
			} = req.body;

			let totalAmount = await Expense.findOne({
				_id: expense_id,
				group_id: group_id,
			}).select('amount');
			let newTotal = totalAmount - paidAmount;

			if (newTotal > 0) {
				await Expense.save({ amount: newTotal });
			} else {
				console.log('Paid Fully');
			}

			let newTransaction = await Transaction.create({
				title,
				payer,
				receiver,
				paidAmount,
				expense_id,
				date,
				user_id,
			});

			res.status(200).json({
				success: true,
				message: 'Transaction added successfully.',
				newTransaction,
			});
		} catch (e) {
			const errors = errorHandler.handleTransactionErrors(e);
			res.status(400).json(errors);
		}
	},
	updateTransaction: async (req, res) => {
		try {
			const {
				_id,
				title,
				payer,
				receiver,
				paidAmount,
				expense_id,
				date,
				user_id,
			} = req.body;

			const updatedData = await Transaction.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						payer,
						receiver,
						paidAmount,
						expense_id,
						date,
						user_id,
					},
				},
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Transaction Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleTransactionErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteTransaction: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Transaction.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Transaction Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default transactionController;
