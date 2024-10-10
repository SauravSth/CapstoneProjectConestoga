import budget from '../models/budgetModel.js';

const budgetController = {
	getBudget: (req, res) => {
		res.send('Budget Page');
	},
};

export default budgetController;
