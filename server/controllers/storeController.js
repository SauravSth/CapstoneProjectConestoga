import store from '../models/storeModel.js';

const storeController = {
	getStore: (req, res) => {
		res.send('Store Page');
	},
};

export default storeController;
