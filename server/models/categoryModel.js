import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

const category = mongoose.model('Category', categorySchema);

export default category;
