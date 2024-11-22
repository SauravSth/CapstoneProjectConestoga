import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	description: {
		type: String,
	},
	amount: {
		type: Number,
		required: [true, 'Please set an amount'],
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

const goal = mongoose.model('Goal', goalSchema);

export default goal;
