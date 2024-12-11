import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
	},
	description: {
		type: String,
	},
	goalAmount: {
		type: Number,
		required: [true, 'Please set a goal amount'],
	},
	savedAmount: {
		type: Number,
		default: 0,
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

const goal = mongoose.model('Goal', goalSchema);

export default goal;
