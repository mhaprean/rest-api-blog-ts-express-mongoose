import express from 'express';
import {
  getArticles,
  createArticle,
  getArticleById,
  likeArticle,
  updateArticle,
} from '../controllers/articleController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

// get all articles
router.get('/', getArticles);

// get single article
router.get('/:id', getArticleById);

// update article
router.put('/:id', isAuth, updateArticle);

// add article
router.post('/', isAuth, createArticle);

// like / dislike an article
router.post('/like/:id', isAuth, likeArticle);

export default router;
