import Transaction from '../models/transactionModel.js';
import errorHandler from '../helpers/errorHandler.js';
import GroupExpense from '../models/groupExpenseModel.js';
import SplitPerMember from '../models/splitPerMemberModel.js';

const transactionController = {
	getTransaction: async (req, res) => {
		try {
			const { uid } = req.user;
			const transactions = await Transaction.find({ user: uid }).populate(
				[
					{ path: 'payer' },
					{ path: 'receiver' },
					{ path: 'groupExpense_id', select: 'amount' },
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
					{ path: 'groupExpense_id', select: 'amount' },
				]
			);

			res.status(200).json({ transaction });
		} catch (e) {
			console.log(e);
		}
	},
	postTransaction: async (req, res) => {
		try {
			const { remarks, paidAmount, groupExpense_id } = req.body;
			const { uid } = req.user;
			const payer = uid;

			const groupExpense = await GroupExpense.findById(groupExpense_id);
			if (!groupExpense) {
				return res.status(404).json({
					success: false,
					message: 'Group expense not found.',
				});
			}

			const receiver = groupExpense.paid_by;

			const splitPerMemberData = await SplitPerMember.find({
				groupExpense_id,
			});

			if (!splitPerMemberData.length) {
				return res.status(400).json({
					success: false,
					message: 'No split data found for this group expense.',
				});
			}

			const payerSplit = splitPerMemberData.find(
				(split) => String(split.user_id) === String(payer)
			);
			if (!payerSplit) {
				return res.status(404).json({
					success: false,
					message: 'Payer not found in split data.',
				});
			}

			payerSplit.splitPerMember -= parseInt(paidAmount);
			await payerSplit.save();

			const receiverSplit = splitPerMemberData.find(
				(split) => String(split.user_id) === String(receiver)
			);
			if (receiverSplit) {
				receiverSplit.splitPerMember += parseInt(paidAmount);
				await receiverSplit.save();
			} else {
				return res.status(404).json({
					success: false,
					message: 'Receiver not found in split data.',
				});
			}

			const newTransaction = await Transaction.create({
				remarks,
				payer,
				receiver,
				paidAmount,
				groupExpense_id,
				user_id: uid,
			});

			const isSettled = splitPerMemberData.every(
				(split) => split.splitPerMember === 0
			);

			res.status(200).json({
				success: true,
				message: isSettled
					? 'Balance settled. Transaction added successfully.'
					: 'Transaction added successfully.',
				newTransaction,
			});
		} catch (e) {
			console.error(e);
			const errors = errorHandler.handleTransactionErrors(e);
			res.status(400).json(errors);
		}
	},
	updateTransaction: async (req, res) => {
		try {
			const { title, payer, receiver, paidAmount, groupExpense_id } =
				req.body;
			const { _id } = req.params;

			const updatedData = await Transaction.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						payer,
						receiver,
						paidAmount,
						groupExpense_id,
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
