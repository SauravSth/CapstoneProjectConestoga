import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	upperLimit: {
		type: Number,
		required: [true, 'Please set an upper limit'],
	},
	lowerLimit: {
		type: String,
		required: [true, 'Please set a lower limit'],
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
