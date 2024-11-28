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
import groupExpenseController from '../controllers/groupExpenseController.js';
import transactionController from '../controllers/transactionController.js';
import goalController from '../controllers/goalController.js';

// Middleware Imports
import validate from '../middlewares/validate.js';
import sanitize from '../middlewares/sanitize.js';
import tokenDecoder from '../middlewares/tokenDecoder.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

// Group Routes
router.get('/group', tokenDecoder, groupController.getGroup);
router.get('/group/:_id', tokenDecoder, groupController.getOneGroup);
router.post('/group', tokenDecoder, groupController.postGroup);
router.patch('/group/:id', tokenDecoder, groupController.updateGroup);
router.delete('/group', tokenDecoder, groupController.deleteGroup);
router.post(
	'/group/inviteToGroup',
	tokenDecoder,
	groupController.inviteToGroup
);
router.post(
	'/group/acceptedInvite/:email/:groupName',
	tokenDecoder,
	groupController.acceptedInvite
);

// Budget Routes
router.get('/budget', tokenDecoder, budgetController.getBudget);
router.get('/budget/:_id', tokenDecoder, budgetController.getOneBudget);
router.post('/budget', tokenDecoder, budgetController.postBudget);
router.patch('/budget/:id', tokenDecoder, budgetController.updateBudget);
router.delete('/budget', tokenDecoder, budgetController.deleteBudget);

// Goal Routes
router.get('/goal', tokenDecoder, goalController.getGoal);
router.get('/goal/:_id', tokenDecoder, goalController.getOneGoal);
router.post('/goal', tokenDecoder, goalController.postGoal);
router.patch('/goal/:id', tokenDecoder, goalController.updateGoal);
router.delete('/goal', tokenDecoder, goalController.deleteGoal);

// Category Routes
router.get('/category', tokenDecoder, categoryController.getCategory);
router.get('/category/:_id', tokenDecoder, categoryController.getOneCategory);
router.post('/category', tokenDecoder, categoryController.postCategory);
router.patch('/category/:id', tokenDecoder, categoryController.updateCategory);
router.delete('/category', tokenDecoder, categoryController.deleteCategory);

// Item Routes
router.get('/item', tokenDecoder, itemController.getItem);
router.get('/item/:_id', tokenDecoder, itemController.getOneItem);
router.post('/item', tokenDecoder, itemController.postItem);
router.patch('/item/:id', tokenDecoder, itemController.updateItem);
router.delete('/item', tokenDecoder, itemController.deleteItem);

// Store Routes
router.get('/store', tokenDecoder, storeController.getStore);
router.get('/store/:_id', tokenDecoder, storeController.getOneStore);
router.post('/store', tokenDecoder, storeController.postStore);
router.patch('/store/:id', tokenDecoder, storeController.updateStore);
router.delete('/store', tokenDecoder, storeController.deleteStore);

// Expense Routes
router.get('/expense', tokenDecoder, expenseController.getExpense);
router.get('/expense/:_id', tokenDecoder, expenseController.getOneExpense);
router.post('/expense', tokenDecoder, expenseController.postExpense);
router.patch('/expense/:id', tokenDecoder, expenseController.updateExpense);
router.delete('/expense', tokenDecoder, expenseController.deleteExpense);

// GroupExpense Routes
router.get('/groupExpense', tokenDecoder, groupExpenseController.getExpense);
router.get(
	'/groupExpense/:_id',
	tokenDecoder,
	groupExpenseController.getOneExpense
);
router.post('/groupExpense', tokenDecoder, groupExpenseController.postExpense);
router.patch(
	'/groupExpense/:id',
	tokenDecoder,
	groupExpenseController.updateExpense
);
router.delete(
	'/groupExpense',
	tokenDecoder,
	groupExpenseController.deleteExpense
);

// Transaction Routes
router.get('/transaction', tokenDecoder, transactionController.getTransaction);
router.get(
	'/transaction/:_id',
	tokenDecoder,
	transactionController.getOneTransaction
);
router.post(
	'/transaction',
	tokenDecoder,
	transactionController.postTransaction
);
router.patch(
	'/transaction/:id',
	tokenDecoder,
	transactionController.updateTransaction
);
router.delete(
	'/transaction',
	tokenDecoder,
	transactionController.deleteTransaction
);

// Admin Routes
router.get('/user', tokenDecoder, userController.getUser);
router.get('/userDetail', tokenDecoder, userController.getOneUser);
router.patch('/user/:id', tokenDecoder, userController.updateUser);
router.delete('/user', tokenDecoder, userController.deleteUser);

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
router.get('/verify/:verificationCode', authController.verifyUser);

export default router;
