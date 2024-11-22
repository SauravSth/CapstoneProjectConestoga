import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter the item name'],
	},
	quantity: {
		type: Number,
		required: [true, 'Please enter the quantity of the item'],
		default: 1,
	},
	price: {
		type: String,
		required: [true, 'Please enter the price of the item'],
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	category_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
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

const item = mongoose.model('Item', itemSchema);

export default item;
