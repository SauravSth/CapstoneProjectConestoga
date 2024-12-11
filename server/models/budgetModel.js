import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	amount: {
		type: Number,
		required: [true, 'Please set an amount'],
	},
	description: {
		type: String,
	},
	remainingAmount: {
		type: Number,
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	group_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
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

const budget = mongoose.model('Budget', budgetSchema);

export default budget;
