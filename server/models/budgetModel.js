import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	upperLimit: {
		type: String,
		required: true,
	},
	lowerLimit: {
		type: String,
		required: true,
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
