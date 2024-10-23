import express from 'express';

// Controller Imports
import pageController from '../controllers/pageController.js';
import userController from '../controllers/userController.js';
import budgetController from '../controllers/budgetController.js';
import itemController from '../controllers/itemController.js';
import categoryController from '../controllers/categoryController.js';
import groupController from '../controllers/groupController.js';
import storeController from '../controllers/storeController.js';
import authController from '../controllers/authController.js';

// Middleware Imports
import validate from '../middlewares/validate.js';
import sanitize from '../middlewares/sanitize.js';
import authentication from '../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

// Page Routes
router.get('/home', authentication, authorization, pageController.getHomePage);

// Group Routes
router.get('/group', groupController.getGroup);
router.post('/group', groupController.postGroup);
router.patch('/group', groupController.updateGroup);
router.delete('/group', groupController.deleteGroup);

// Budget Routes
router.get('/budget', budgetController.getBudget);
router.post('/budget', budgetController.postBudget);
router.patch('/budget', budgetController.updateBudget);
router.delete('/budget', budgetController.deleteBudget);

// Category Routes
router.get('/category', categoryController.getCategory);
router.post('/category', categoryController.postCategory);
router.patch('/category', categoryController.updateCategory);
router.delete('/category', categoryController.deleteCategory);

// Item Routes
router.get('/item', itemController.getItem);
router.post('/item', itemController.postItem);
router.patch('/item', itemController.updateItem);
router.delete('/item', itemController.deleteItem);

// Store Routes
router.get('/store', storeController.getStore);
router.post('/store', storeController.postStore);
router.patch('/store', storeController.updateStore);
router.delete('/store', storeController.deleteStore);

// Admin Routes
router.get('/user', userController.getUser);

// Auth Routes
router.get('/login', authController.getUserLogin);
router.get('/signup', authController.getUserSignUp);
router.post('/login', authController.postUserLogin);
router.post(
	'/signup',
	sanitize.trimmer,
	validate.doPasswordsMatch,
	authController.postUserSignUp
);
router.get('/logout', authController.getUserLogout);

export default router;
