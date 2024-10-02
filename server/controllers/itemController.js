import item from '../models/itemModel.js';

const itemController = {
	getItem: (req, res) => {
		res.send('Item Page');
	},
};

export default itemController;
