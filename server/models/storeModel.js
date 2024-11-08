import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide the store name'],
		unique: true,
	},
	// address: {
	// 	type: String,
	// },
	// postalCode: {
	// 	type: String,
	// },
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const store = mongoose.model('Store', storeSchema);

export default store;
