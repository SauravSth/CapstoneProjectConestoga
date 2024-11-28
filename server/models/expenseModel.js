import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	date: {
		type: Date,
		required: [true, 'Date is required'],
	},
	amount: {
		type: Number,
		required: [true, 'Amount is required'],
	},
	description: {
		type: String,
	},
	category_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	budget_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Budget',
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

const expense = mongoose.model('Expense', expenseSchema);

export default expense;
