import express from 'express';
import { getCategories, getCategoryById, createCategory } from '../controllers/categoryController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

// get all categories
router.get('/', getCategories);


// get single category 
router.get('/:id', getCategoryById);

// add category
router.post('/', isAuth, createCategory);


export default router;
