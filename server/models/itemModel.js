import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
	},
});

const item = mongoose.model('Item', itemSchema);

export default item;
