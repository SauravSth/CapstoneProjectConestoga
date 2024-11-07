import express from 'express';

// Controller Imports
import userController from '../controllers/userController.js';
import budgetController from '../controllers/budgetController.js';
import itemController from '../controllers/itemController.js';
import categoryController from '../controllers/categoryController.js';
import groupController from '../controllers/groupController.js';
import storeController from '../controllers/storeController.js';
import authController from '../controllers/authController.js';
import expenseController from '../controllers/expenseController.js';

// Middleware Imports
import validate from '../middlewares/validate.js';
import sanitize from '../middlewares/sanitize.js';
import authentication from '../middlewares/authentication.js';
import tokenDecoder from '../middlewares/tokenDecoder.js';

const router = express.Router();

// Group Routes
router.get('/group', groupController.getGroup);
router.get('/group/:_id', groupController.getOneGroup);
router.post('/group', groupController.postGroup);
router.patch('/group', groupController.updateGroup);
router.delete('/group', groupController.deleteGroup);

// Budget Routes
router.get('/budget', budgetController.getBudget);
router.get('/budget/:_id', budgetController.getOneBudget);
router.post('/budget', budgetController.postBudget);
router.patch('/budget', budgetController.updateBudget);
router.delete('/budget', budgetController.deleteBudget);

// Category Routes
router.get('/category', categoryController.getCategory);
router.get('/category/:_id', categoryController.getOneCategory);
router.post('/category', categoryController.postCategory);
router.patch('/category', categoryController.updateCategory);
router.delete('/category', categoryController.deleteCategory);

// Item Routes
router.get('/item', itemController.getItem);
router.get('/item/:_id', itemController.getOneItem);
router.post('/item', itemController.postItem);
router.patch('/item', itemController.updateItem);
router.delete('/item', itemController.deleteItem);

// Store Routes
router.get('/store', storeController.getStore);
router.get('/store/:_id', storeController.getOneStore);
router.post('/store', storeController.postStore);
router.patch('/store', storeController.updateStore);
router.delete('/store', storeController.deleteStore);

// Expense Routes
router.get('/expense', expenseController.getExpense);
router.get('/expense/:_id', expenseController.getOneExpense);
router.post('/expense', expenseController.postExpense);
router.patch('/expense', expenseController.updateExpense);
router.delete('/expense', expenseController.deleteExpense);

// Admin Routes
router.get('/user', userController.getUser);
router.get('/userDetail', userController.getOneUser);
router.patch('/user', userController.updateUser);
router.delete('/user', userController.deleteUser);

// TEST ROUTES
router.get('/test', tokenDecoder, userController.testRoute);

// Auth Routes
router.post('/login', authController.postUserLogin);
router.post(
	'/signup',
	sanitize.trimmer,
	validate.doPasswordsMatch,
	authController.postUserSignUp
);
router.get('/logout', authController.getUserLogout);

export default router;
