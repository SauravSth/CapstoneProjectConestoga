import mongoose from 'mongoose';

const splitPerMemberSchema = mongoose.Schema({
	splitPerMember: {
		type: Number,
	},
	group_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	groupExpense_id: {
		type: mongoose.Types.ObjectId,
		ref: 'GroupExpense',
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
const splitPerMember = mongoose.model('SplitPerMember', splitPerMemberSchema);

export default splitPerMember;
