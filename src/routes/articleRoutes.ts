import express from 'express';
import { getArticles, createArticle, getArticleById } from '../controllers/articleController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

// get all articles
router.get('/', getArticles);

// get single article 
router.get('/:id', getArticleById);

// add article
router.post('/', isAuth, createArticle);



export default router;
