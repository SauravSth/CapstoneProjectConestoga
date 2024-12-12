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
		const today = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(today.getMonth() - 1);
		const twoMonthsAgo = new Date();
		twoMonthsAgo.setMonth(today.getMonth() - 2);

		const graphData = await Expense.aggregate([
			{
				$match: {
					date: {
						$gte: twoMonthsAgo,
						$lte: today,
					},
				},
			},
			{
				$group: {
					_id: {
						$cond: [
							{ $gte: ['$date', oneMonthAgo] },
							'lastMonth',
							'twoMonthsAgo',
						],
					},
					totalAmount: { $sum: '$amount' },
					count: { $sum: 1 },
				},
			},
		]);
		res.status(200).json({ graphData });
	},
};

export default graphController;
