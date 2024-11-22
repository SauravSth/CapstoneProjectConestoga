import mongoose from 'mongoose';

const groupExpenseSchema = mongoose.Schema({
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
	paid_by: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	group_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
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

const groupExpense = mongoose.model('GroupExpense', groupExpenseSchema);

export default groupExpense;
