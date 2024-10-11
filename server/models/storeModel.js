import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide the store name'],
	},
	address: {
		type: String,
	},
	postalCode: {
		type: String,
	},
});

const store = mongoose.model('Store', storeSchema);

export default store;
