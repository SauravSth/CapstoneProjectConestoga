import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	payer: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	receiver: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	paidAmount: {
		type: Number,
		required: [true, 'Paid Amount is required'],
	},
	groupExpense_id: {
		type: mongoose.Types.ObjectId,
		ref: 'GroupExpense',
	},

	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
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

const transaction = mongoose.model('Transaction', transactionSchema);

export default transaction;
