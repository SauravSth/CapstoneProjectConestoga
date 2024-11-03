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
	category: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
		required: [true, 'Expense should have a category'],
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'Expense should have a user'],
	},
	group: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

const expense = mongoose.model('Expense', expenseSchema);

export default expense;
