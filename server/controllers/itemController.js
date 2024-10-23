import Item from '../models/itemModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const itemController = {
	getItem: async (req, res) => {
		try {
			const items = await Item.find({});

			res.status(200).json({ items });
		} catch (e) {
			console.log(e);
		}
	},
	postItem: async (req, res) => {
		try {
			const { name, quantity, price, category_id } = req.body;
			let newItem = await Item.create({
				name,
				quantity,
				price,
				category_id,
			});

			res.status(200).json({
				success: true,
				message: 'Item created successfully.',
				newItem,
			});
		} catch (e) {
			const errors = errorHandler.handleItemErrors(e);
			res.status(400).json(errors);
		}
	},
	updateItem: async (req, res) => {
		try {
			const { _id, name, quantity, price, category_id } = req.body;

			const updatedData = await Item.findOneAndUpdate(
				{ _id },
				{ $set: { name, quantity, price, category_id } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Item Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleItemErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteItem: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Item.findOneAndDelete({ _id });

			res.status(200).json({
				success: true,
				message: 'Item Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default itemController;
