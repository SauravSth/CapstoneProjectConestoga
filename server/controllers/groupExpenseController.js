import GroupExpense from '../models/groupExpenseModel.js';
import Group from '../models/groupModel.js';
import SplitPerMember from '../models/splitPerMemberModel.js';

import errorHandler from '../helpers/errorHandler.js';
import calculateSplits from '../helpers/calculateSplits.js';

const groupExpenseController = {
	getExpense: async (req, res) => {
		try {
			const { uid } = req.user;
			const groupExpenses = await GroupExpense.find({
				user_id: uid,
			}).populate('category_id user_id paid_by group_id');

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
			}).populate('category_id user_id paid_by group_id');

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
				splitType,
				splitDetails,
				description,
				paid_by,
				category_id,
				group_id,
			} = req.body;

			const { uid } = req.user;

			paid_by = !paid_by ? uid : paid_by;

			const group = await Group.findById(group_id);
			if (!group)
				return res.status(404).json({ message: 'Group not found' });

			const members = group.members;
			if (members.length === 0)
				return res
					.status(400)
					.json({ message: 'Group has no members' });

			let newExpense = await GroupExpense.create({
				title,
				date,
				amount,
				splitType,
				splitDetails,
				description,
				paid_by,
				category_id,
				user_id: uid,
				group_id,
			});
			const splits = await calculateSplits(
				splitType,
				amount,
				members,
				splitDetails
			);
			const splitEntries = splits.map((split) => ({
				groupExpense_id: newExpense._id,
				group_id: group_id,
				user_id: split.member_id,
				splitPerMember:
					split.amount -
					(String(paid_by) === String(split.member_id) ? amount : 0),
			}));
			console.log('here', splitEntries);
			await SplitPerMember.insertMany(splitEntries);

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
				title,
				date,
				amount,
				splitType,
				description,
				paid_by,
				category_id,
				group_id,
				splitDetails,
			} = req.body;
			const { _id } = req.params;

			const existingExpense = await GroupExpense.findById(_id);
			if (!existingExpense) {
				return res
					.status(404)
					.json({ success: false, message: 'Expense not found' });
			}

			const group = await Group.findById(
				group_id || existingExpense.group_id
			);
			if (!group) {
				return res
					.status(404)
					.json({ success: false, message: 'Group not found' });
			}

			const members = group.members;

			const updatedExpense = await GroupExpense.findOneAndUpdate(
				{ _id },
				{
					$set: {
						title,
						date,
						amount,
						splitType,
						description,
						paid_by,
						category_id,
						group_id,
					},
				},
				{ new: true }
			);

			if (amount || splitType || splitDetails || paid_by) {
				await SplitPerMember.deleteMany({ expense_id: _id });

				const splits = calculateSplits(
					splitType || existingExpense.splitType,
					amount || existingExpense.amount,
					members,
					splitDetails || existingExpense.splitDetails
				);

				const splitEntries = splits.map((split) => ({
					expense_id: _id,
					group_id: group_id || existingExpense.group_id,
					member_id: split.member_id,
					amount:
						split.amount -
						(paid_by.equals(split.member_id) ? amount : 0),
				}));

				await SplitPerMember.insertMany(splitEntries);
			}

			res.status(200).json({
				success: true,
				message: 'GroupExpense and splits updated successfully',
				updatedExpense,
			});
		} catch (e) {
			const errors = errorHandler.handleExpenseErrors(e);
			res.status(400).json({ success: false, errors });
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
