import Category from '../models/categoryModel.js';

// Error handler import
import errorHandler from '../helpers/errorHandler.js';

const categoryController = {
	getCategory: async (req, res) => {
		try {
			const { uid } = req.user;
			const categories = await Category.find({ user_id: uid });

			res.status(200).json({ categories });
		} catch (e) {
			console.log(e);
		}
	},
	getOneCategory: async (req, res) => {
		try {
			const id = req.params._id;

			const category = await Category.findOne({ _id: id });

			res.status(200).json({ category });
		} catch (e) {
			console.log(e);
		}
	},
	postCategory: async (req, res) => {
		try {
			const { name } = req.body;
			let newCategory = await Category.create({
				name,
			});

			res.status(200).json({
				success: true,
				message: 'Category created successfully.',
				newCategory,
			});
		} catch (e) {
			const errors = errorHandler.handleCategoryErrors(e);
			res.status(400).json(errors);
		}
	},
	updateCategory: async (req, res) => {
		try {
			const { _id, name } = req.body;

			const updatedData = await Category.findOneAndUpdate(
				{ _id },
				{ $set: { name } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Category Updated',
				updatedData,
			});
		} catch (e) {
			const errors = errorHandler.handleCategoryErrors(e);
			res.status(400).json(errors);
		}
	},
	deleteCategory: async (req, res) => {
		try {
			const { _id } = req.body;

			const deletedData = await Category.findOneAndUpdate(
				{ _id },
				{ $set: { isActive: false } },
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Category Deleted',
				deletedData,
			});
		} catch (e) {
			console.log(e.message);
		}
	},
};

export default categoryController;
