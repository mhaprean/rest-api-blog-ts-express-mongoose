import express from 'express';
import { getTags, getTagById, createTag } from '../controllers/tagController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

// get all tags
router.get('/', getTags);


// get single tag 
router.get('/:id', getTagById);

// add tag
router.post('/', isAuth, createTag);


export default router;
