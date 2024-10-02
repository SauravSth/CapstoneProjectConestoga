import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';
import budgetController from '../controllers/budgetController.js';
import itemController from '../controllers/itemController.js';
import categoryController from '../controllers/categoryController.js';
import groupController from '../controllers/groupController.js';
import storeController from '../controllers/storeController.js';

const router = express.Router();

// Home Route
router.get('/home', homeController.getHome);
router.get('/group', groupController.getGroup);
router.get('/budget', budgetController.getBudget);
router.get('/category', categoryController.getCategory);
router.get('/item', itemController.getItem);
router.get('/store', storeController.getStore);
router.get('/user', userController.getUser);

export default router;
