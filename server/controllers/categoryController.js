import categoryModel from '../models/categoryModel.js';

const categoryController = {
	getHome: (req, res) => {
		res.send('Category');
	},
};

export default categoryController;
