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
};

export default graphController;
