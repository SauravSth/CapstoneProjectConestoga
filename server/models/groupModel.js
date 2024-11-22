import mongoose, { mongo } from 'mongoose';

const groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a group name'],
	},
	members: [
		{
			user_id: mongoose.Types.ObjectId,
			split: Number,
		},
	],
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const group = mongoose.model('Group', groupSchema);

export default group;
