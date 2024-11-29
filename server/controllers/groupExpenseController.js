import GroupExpense from '../models/groupExpenseModel.js';
import Group from '../models/groupModel.js';
import Budget from '../models/budgetModel.js';
import errorHandler from '../helpers/errorHandler.js';

// const editBudgetAmount = async (amount) => {
// 	let budgetAmount = await Budget.findOne({ budget_id }).select('amount');
// 	let remainingBudget = budgetAmount - amount;
// 	if (remainingBudget >= 0) {
// 		await Budget.save({ remainingAmount: remainingBudget });
// 	} else {
// 		res.status(400).json({
// 			success: false,
// 			message: 'Budget limit has been exceeded',
// 		});
// 	}
// };

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
				description,
				paid_by,
				category_id,
				group_id,
				percentSplits,
				amountSplits,
			} = req.body;

			const { uid } = req.user;

			paid_by = !paid_by ? uid : paid_by;

			const groupData = await Group.findById(group_id);

			if (!groupData)
				return res
					.status(404)
					.json({ success: false, message: 'Group not found' });

			const members = groupData.members;

			let amountsOwed = [];
			let totalAmountOwed = 0;

			if (splitType === 'evenly') {
				const numMembers = members.length;
				const amountPerMember = amount / numMembers;

				amountsOwed = members
					.map((member) => {
						if (member.user_id.toString() !== paid_by.toString()) {
							return {
								user_id: member.user_id,
								amountOwed: amountPerMember,
							};
						}
						return null;
					})
					.filter((owed) => owed !== null);

				totalAmountOwed = amountPerMember * (numMembers - 1);
			} else if (splitType === 'percent') {
				let totalPercent = 0;
				amountsOwed = members.map((member) => {
					const userPercent = percentSplits.find(
						(split) =>
							split.user_id.toString() ===
							member.user_id.toString()
					);
					if (userPercent) {
						if (
							userPercent.percent < 0 ||
							userPercent.percent > 100
						) {
							throw new Error(
								'Percent split must be between 0 and 100'
							);
						}
						const amountOwed = (userPercent.percent / 100) * amount;
						totalAmountOwed += amountOwed;
						totalPercent += userPercent.percent;

						return {
							user_id: member.user_id,
							amountOwed: amountOwed,
						};
					}
					return null;
				});

				if (totalPercent !== 100) {
					throw new Error('Total percentage split must sum to 100');
				}
			} else if (splitType === 'amount') {
				let totalAssignedAmount = 0;
				amountsOwed = members.map((member) => {
					const userAmount = amountSplits.find(
						(split) =>
							split.user_id.toString() ===
							member.user_id.toString()
					);
					if (userAmount) {
						if (
							userAmount.amount < 0 ||
							userAmount.amount > amount
						) {
							throw new Error(
								'Amount split must be between 0 and total amount'
							);
						}
						totalAssignedAmount += userAmount.amount;
						return {
							user_id: member.user_id,
							amountOwed: userAmount.amount,
						};
					}
					return null;
				});

				if (totalAssignedAmount !== amount) {
					throw new Error(
						'The total of custom amounts owed must equal the total amount'
					);
				}
			}

			groupData.members = groupData.members.map((member) => {
				const owed = amountsOwed.find(
					(owedMember) =>
						owedMember.user_id.toString() ===
						member.user_id.toString()
				);
				if (owed) {
					member.splitAmount = owed.amountOwed;
				}
				return member;
			});

			await groupData.save();

			// if (budget_id) {
			// 	editBudgetAmount(amount);
			// }

			let newExpense = await GroupExpense.create({
				title,
				date,
				amount,
				splitType,
				description,
				paid_by,
				category_id,
				user_id: uid,
				group_id,
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
				splitType,
				description,
				paid_by,
				category_id,
				group_id,
				percentSplits,
				amountSplits,
			} = req.body;

			const groupData = await Group.findById(group_id);

			if (!groupData)
				return res
					.status(404)
					.json({ success: false, message: 'Group not found' });

			const members = groupData.members;

			let amountsOwed = [];
			let totalAmountOwed = 0;

			if (splitType === 'evenly') {
				const numMembers = members.length;
				const amountPerMember = amount / numMembers;

				amountsOwed = members
					.map((member) => {
						if (member.user_id.toString() !== paid_by.toString()) {
							return {
								user_id: member.user_id,
								amountOwed: amountPerMember,
							};
						}
						return null;
					})
					.filter((owed) => owed !== null);

				totalAmountOwed = amountPerMember * (numMembers - 1);
			} else if (splitType === 'percent') {
				let totalPercent = 0;
				amountsOwed = members.map((member) => {
					const userPercent = percentSplits.find(
						(split) =>
							split.user_id.toString() ===
							member.user_id.toString()
					);
					if (userPercent) {
						if (
							userPercent.percent < 0 ||
							userPercent.percent > 100
						) {
							throw new Error(
								'Percent split must be between 0 and 100'
							);
						}
						const amountOwed = (userPercent.percent / 100) * amount;
						totalAmountOwed += amountOwed;
						totalPercent += userPercent.percent;

						return {
							user_id: member.user_id,
							amountOwed: amountOwed,
						};
					}
					return null;
				});

				if (totalPercent !== 100) {
					throw new Error('Total percentage split must sum to 100');
				}
			} else if (splitType === 'amount') {
				let totalAssignedAmount = 0;
				amountsOwed = members.map((member) => {
					const userAmount = amountSplits.find(
						(split) =>
							split.user_id.toString() ===
							member.user_id.toString()
					);
					if (userAmount) {
						if (
							userAmount.amount < 0 ||
							userAmount.amount > amount
						) {
							throw new Error(
								'Amount split must be between 0 and total amount'
							);
						}
						totalAssignedAmount += userAmount.amount;
						return {
							user_id: member.user_id,
							amountOwed: userAmount.amount,
						};
					}
					return null;
				});

				if (totalAssignedAmount !== amount) {
					throw new Error(
						'The total of custom amounts owed must equal the total amount'
					);
				}
			}

			groupData.members = groupData.members.map((member) => {
				const owed = amountsOwed.find(
					(owedMember) =>
						owedMember.user_id.toString() ===
						member.user_id.toString()
				);
				if (owed) {
					member.splitAmount = owed.amountOwed;
				}
				return member;
			});

			await groupData.save();

			// if (budget_id) {
			// 	editBudgetAmount(amount);
			// }

			const updatedData = await GroupExpense.findOneAndUpdate(
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
