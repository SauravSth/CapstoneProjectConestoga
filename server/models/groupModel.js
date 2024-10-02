import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	members: {
		type: Array,
		default: [],
	},
});

const group = mongoose.model('Group', groupSchema);

export default group;
