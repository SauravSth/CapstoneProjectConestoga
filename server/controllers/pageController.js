const homeController = {
	getHomePage: (req, res) => {
		res.send('Home');
	},
	getBudgetPage: (req, res) => {
		res.send('Budget');
	},
	getCategoryPage: (req, res) => {
		res.send('Category');
	},
	getItemPage: (req, res) => {
		res.send('Item');
	},
	getGroupPage: (req, res) => {
		res.send('Group');
	},
	getStorePage: (req, res) => {
		res.send('Store');
	},
};

export default homeController;
