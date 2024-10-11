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
		type: Number,
		required: [true, 'Please enter the price of the item'],
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
	},
});

const item = mongoose.model('Item', itemSchema);

export default item;
