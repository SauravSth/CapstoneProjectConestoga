import Category from '../models/categoryModel.js';
import GroupExpense from '../models/groupExpenseModel.js';
import Expense from '../models/expenseModel.js';

// Error handler import
import errorHandler from '../helpers/errorHandler.js';

const categoryController = {
	getCategory: async (req, res) => {
		try {
			const categories = await Category.find({});

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
			const file = req.file;

			let newCategory = await Category.create({
				name,
				imagePath: file.path,
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
			const { name } = req.body;
			const { _id } = req.params;

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

			const isCategoryBeingUsed = await Expense.findOne({
				category_id: _id,
			});
			const isCategoryBeingUsedInGroup = await GroupExpense.findOne({
				category_id: _id,
			});

			if (isCategoryBeingUsed || isCategoryBeingUsedInGroup) {
				return res.status(400).json({
					success: false,
					message: 'Category is being used. Cannot delete.',
				});
			}

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
