import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter the category name'],
		unique: true,
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

const category = mongoose.model('Category', categorySchema);

export default category;
