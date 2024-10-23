import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a group name'],
	},
	members: {
		type: Array,
		default: [],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

const group = mongoose.model('Group', groupSchema);

export default group;
