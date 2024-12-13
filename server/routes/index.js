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
import authentication from '../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';

import fileUploadHelper from '../helpers/fileUploadHelper.js';
import splitPerMemberController from '../controllers/splitPerMemberController.js';
import graphController from '../controllers/graphController.js';

const router = express.Router();

// Group Routes
router.get('/group', authentication, groupController.getGroup);
router.get('/group/:_id', authentication, groupController.getOneGroup);
router.post('/group', authentication, groupController.postGroup);
router.patch('/group/:_id', authentication, groupController.updateGroup);
router.delete('/group', authentication, groupController.deleteGroup);
router.post(
	'/group/inviteToGroup',
	authentication,
	groupController.inviteToGroup
);
router.post(
	'/group/acceptedInvite/:email/:groupId',
	groupController.acceptedInvite
);

// Budget Routes
router.get('/budget', authentication, budgetController.getBudget);
router.get('/budget/:_id', authentication, budgetController.getOneBudget);
router.post('/budget', authentication, budgetController.postBudget);
router.patch('/budget/:_id', authentication, budgetController.updateBudget);
router.delete('/budget', authentication, budgetController.deleteBudget);

// Goal Routes
router.get('/goal', authentication, goalController.getGoal);
router.get('/goal/:_id', authentication, goalController.getOneGoal);
router.post('/goal', authentication, goalController.postGoal);
router.patch('/goal/:_id', authentication, goalController.updateGoal);
router.delete('/goal', authentication, goalController.deleteGoal);

// Category Routes
router.get(
	'/category',
	authentication,
	// authorization,
	categoryController.getCategory
);
router.get(
	'/category/:_id',
	authentication,
	// authorization,
	categoryController.getOneCategory
);
router.post(
	'/category',
	authentication,
	// authorization,
	fileUploadHelper.single('image'),
	categoryController.postCategory
);
router.patch(
	'/category/:_id',
	authentication,
	// authorization,
	categoryController.updateCategory
);
router.delete(
	'/category',
	authentication,
	// authorization,
	categoryController.deleteCategory
);

// Item Routes
router.get('/item', authentication, itemController.getItem);
router.get('/item/:_id', authentication, itemController.getOneItem);
router.post('/item', authentication, itemController.postItem);
router.patch('/item/:_id', authentication, itemController.updateItem);
router.delete('/item', authentication, itemController.deleteItem);

// Store Routes
router.get('/store', authentication, storeController.getStore);
router.get('/store/:_id', authentication, storeController.getOneStore);
router.post('/store', authentication, storeController.postStore);
router.patch('/store/:_id', authentication, storeController.updateStore);
router.delete('/store', authentication, storeController.deleteStore);

// Expense Routes
router.get('/expense', authentication, expenseController.getExpense);
router.get('/expense/:_id', authentication, expenseController.getOneExpense);
router.post('/expense', authentication, expenseController.postExpense);
router.patch('/expense/:_id', authentication, expenseController.updateExpense);
router.delete('/expense', authentication, expenseController.deleteExpense);

// GroupExpense Routes
router.get('/groupExpense', authentication, groupExpenseController.getExpense);
router.get(
	'/groupExpense/:_id',
	authentication,
	groupExpenseController.getOneExpense
);
router.post(
	'/groupExpense',
	authentication,
	groupExpenseController.postExpense
);
router.patch(
	'/groupExpense/:_id',
	authentication,
	groupExpenseController.updateExpense
);
router.delete(
	'/groupExpense',
	authentication,
	groupExpenseController.deleteExpense
);

// Transaction Routes
router.get(
	'/transaction',
	authentication,
	transactionController.getTransaction
);
router.get(
	'/transaction/:_id',
	authentication,
	transactionController.getOneTransaction
);
router.post(
	'/transaction',
	authentication,
	transactionController.postTransaction
);
router.patch(
	'/transaction/:_id',
	authentication,
	transactionController.updateTransaction
);
router.delete(
	'/transaction',
	authentication,
	transactionController.deleteTransaction
);

// Admin Routes
router.get('/user', authentication, authorization, userController.getUser);
router.get(
	'/userDetail',
	authentication,
	authorization,
	userController.getUserDetails
);
router.post('/user', authentication, authorization, userController.createUser);
router.patch(
	'/user/:_id',
	authentication,
	authorization,
	userController.updateUser
);
router.delete(
	'/user',
	authentication,
	authorization,
	userController.deleteUser
);

// SPLIT PER MEMBER ROUTES
router.get(
	'/splitPerOneMember/:groupExpense_id',
	authentication,
	splitPerMemberController.getSplitPerOneMember
);
router.get(
	'/splitPerMember/:groupExpense_id',
	authentication,
	splitPerMemberController.getSplitPerMember
);

// GRAPH DATA
router.get(
	'/graph/getExpensePerCategory',
	authentication,
	graphController.getExpensePerCategory
);
router.get(
	'/graph/getExpensePerMonth',
	authentication,
	graphController.getGraphForExpensePerMonth
);

// Auth Routes
router.get('/userDetail/:_id', authentication, userController.getOneUser);
router.post('/login', authController.postUserLogin);
router.post(
	'/signup',
	sanitize.trimmer,
	validate.doPasswordsMatch,
	authController.postUserSignUp
);
router.get('/logout', authController.getUserLogout);
router.post('/verify/:verificationCode', authController.verifyUser);
router.post('/registerFromInvite/:group_id', authController.registerFromInvite);

export default router;
