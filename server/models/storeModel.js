import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
	},
});

const store = mongoose.model('Store', storeSchema);

export default store;
