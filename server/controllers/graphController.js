import Expense from '../models/expenseModel.js';
import mongoose from 'mongoose';

const graphController = {
	// Get data based on category
	getExpensePerCategory: async (req, res) => {
		try {
			const { uid } = req.user;

			const graphData = await Expense.aggregate([
				{
					$match: {
						user_id: new mongoose.Types.ObjectId(uid),
						isActive: true,
					},
				},
				{
					$group: {
						_id: '$category_id',
						totalAmount: {
							$sum: '$amount',
						},
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: '_id',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
				{
					$project: {
						category: '$category.name',
						amountSpent: '$totalAmount',
					},
				},
			]);

			res.status(200).json({ graphData });
		} catch (e) {
			console.log(e);
		}
	},
	getGraphForExpensePerMonth: async (req, res) => {
		try {
			const today = new Date();
			const oneMonthAgo = new Date();
			oneMonthAgo.setMonth(today.getMonth() - 1);
			const twoMonthsAgo = new Date();
			twoMonthsAgo.setMonth(today.getMonth() - 2);

			const expenses = await Expense.find({
				date: { $gte: twoMonthsAgo, $lte: today },
				user_id: req.user.uid,
			}).lean();

			const lastMonthExpenses = [];
			const twoMonthsAgoExpenses = [];

			expenses.forEach((expense) => {
				if (expense.date >= oneMonthAgo) {
					lastMonthExpenses.push(expense);
				} else {
					twoMonthsAgoExpenses.push(expense);
				}
			});

			const groupByDate = (data) =>
				data.reduce((acc, curr) => {
					const dateStr = curr.date.toISOString().split('T')[0];
					if (!acc[dateStr]) {
						acc[dateStr] = {
							totalAmount: 0,
							expenses: [],
						};
					}
					acc[dateStr].totalAmount += curr.amount;
					acc[dateStr].expenses.push({
						title: curr.title,
						amount: curr.amount,
						date: curr.date,
					});
					return acc;
				}, {});

			const groupedLastMonth = groupByDate(lastMonthExpenses);
			const groupedTwoMonthsAgo = groupByDate(twoMonthsAgoExpenses);

			res.status(200).json({ groupedLastMonth, groupedTwoMonthsAgo });
		} catch (error) {
			console.error('Error fetching expense data:', error);
			throw error;
		}
	},
};

export default graphController;
