import Store from '../models/storeModel.js';

// Error Handler Import
import errorHandler from '../helpers/errorHandler.js';

const storeController = {
	getStore: async (req, res) => {
		try {
			const stores = await Store.find({ isActive: true });

			res.status(200).json({ stores });
		} catch (e) {
			console.log(e);
		}
	},
	getOneStore: async (req, res) => {
		try {
			const id = req.params._id;

			const store = await Store.findOne({ _id: id });

			res.status(200).json({ store });
		} catch (e) {
			console.log(e);
		}
	},
	postStore: async (req, res) => {
		try {
			const { name } = req.body;
			let newStore = await Store.create({
				name,
			});

			res.status(200).json({
				success: true,
				message: 'Store created successfully.',
				newStore,
			});
		} catch (e) {
			const errors = errorHandler.handleStoreErrors(e);
			res.status(400).json(errors);
		}
	},
	updateStore: async (req, res) => {
		try {
			const { _id, name } = req.body;

			const updatedData = await Store.findOneAndUpdate(
				{ _id },
				{ $set: { name } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Store Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleStoreErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteStore: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Store.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Store Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e);
		}
	},
};

export default storeController;
