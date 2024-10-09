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
import authenticateToken from '../middlewares/authenticate.js';

const router = express.Router();

// Page Routes
router.get('/home', pageController.getHomePage);
router.get('/budget', pageController.getBudgetPage);
router.get('/category', pageController.getCategoryPage);
router.get('/store', pageController.getStorePage);
router.get('/item', pageController.getItemPage);
router.get('/group', pageController.getGroupPage);

// Group Routes
router.get('/group', groupController.getGroup);

// Budget Routes
router.get('/budget', budgetController.getBudget);

// Category Routes
router.get('/category', categoryController.getCategory);

// Item Routes
router.get('/item', itemController.getItem);

// Store Routes
router.get('/store', storeController.getStore);

// User Routes
router.get('/user', userController.getUser);
router.get('/login', authController.getUserLogin);
router.get('/signup', authController.getUserSignUp);

// Auth Routes
router.post('/login', authController.postUserLogin);
router.post(
	'/signup',
	validate.doPasswordsMatch,
	authController.postUserSignUp
);

export default router;
