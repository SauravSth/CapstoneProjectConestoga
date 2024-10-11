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
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	group: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
	},
});

const budget = mongoose.model('Budget', budgetSchema);

export default budget;
