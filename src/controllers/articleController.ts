import { Request, Response, NextFunction } from 'express';
import Article, { IArticle } from '../models/Article';
import Tag from '../models/Tag';
import Category from '../models/Category';
import Joi from 'joi';

export const getArticles = async (
  req: Request<{}, {}, {}, { page?: number; limit?: number }>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const articles = await Article.find().sort('-updatedAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name subscribers');

    const total = await Article.find().countDocuments();

    return res.status(200).json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getArticleById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const article = await Article.findById(id);

    return res.status(200).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createArticle = async (
  req: Request<{}, {}, IArticle>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const joiSchema = Joi.object({
      title: Joi.string().min(3).max(60).required(),
      description: Joi.string().min(3).required(),
      image: Joi.string(),
      tags: Joi.array().items(Joi.string().hex().length(24)),
      category: Joi.string().hex().length(24),
    });

    const { error } = joiSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error);
    }

    const { title, description, tags = [], category = null, image } = req.body;
    const newArticle = { title, description, user: userId, tags, category, image };
    const article = await Article.create(newArticle);

    const updateTags = await Tag.updateMany(
      { _id: article.tags },
      { $push: { articles: article._id } }
    );

    const updateCategory = await Category.findByIdAndUpdate(article.category, {
      $push: { articles: article._id },
    });

    return res.status(201).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteArticle = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(400).json('Wrong article id.');
    }

    const deleteFromTags = await Tag.updateMany(
      { _id: article.tags },
      { $pull: { articles: article._id } }
    );

    const deleteFromCategory = await Category.findOneAndUpdate(
      { _id: article.category },
      { $pull: { articles: article._id } }
    );

    await article.remove();

    return res.status(200).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const likeArticle = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(400).json('Wrong article id.');
    }
    if (!userId) {
      return res.status(400).json('You are not authenticated.');
    }

    if (article.likes.includes(userId)) {
      const removeLike = await article.updateOne({ $pull: { likes: userId } });
      return res.status(200).json('Like removed from article');
    } else {
      const addLike = await article.updateOne({ $push: { likes: userId } });
      return res.status(200).json('Like added to article');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

// returns the items from the first array that are not part of the second array.
const difference = (arrA: string[], arrB: string[]) => {
  const result = [];
  for (const p of arrA) {
    if (!arrB.includes(p)) {
      result.push(p);
    }
  }

  return result;
};

export const updateArticle = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const userId = req.userId;

    const oldArticle = await Article.findById(id);

    if (!oldArticle) {
      return res.status(400).send('wrong article id');
    }

    const oldTags = oldArticle.tags;
    const oldCategory = oldArticle.category;

    const joiSchema = Joi.object({
      title: Joi.string().min(3).max(60).required(),
      description: Joi.string().min(3).required(),
      image: Joi.string(),
      imageThumb: Joi.string(),
      tags: Joi.array().items(Joi.string().hex().length(24)),
      likes: Joi.array().items(Joi.string().hex().length(24)),
      category: Joi.string().hex().length(24),
      user: Joi.string().hex().length(24),
    });

    const { error } = joiSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error);
    }

    const { title, description, tags, category, image, imageThumb, user } = req.body;
    const newArticle = { title, description, user, tags, category, image, imageThumb };

    Object.assign(oldArticle, newArticle);

    const updatedArticle = await oldArticle.save();

    const addedTags = difference(newArticle.tags, oldTags);
    const removedTags = difference(oldTags, newArticle.tags);

    const addTags = await Tag.updateMany(
      { _id: addedTags },
      { $push: { articles: updatedArticle._id } }
    );

    const removeTags = await Tag.updateMany(
      { _id: removedTags },
      { $pull: { articles: updatedArticle._id } }
    );

    if (oldCategory !== newArticle.category) {
      const removeArticleFromOldCategory = await Category.findByIdAndUpdate(oldCategory, {
        $pull: { articles: updatedArticle._id },
      });

      const addArticleToNewCategory = await Category.findByIdAndUpdate(newArticle.category, {
        $push: { articles: updatedArticle._id },
      });
    }

    return res.status(201).json(updatedArticle);
  } catch (error) {
    return res.status(400).json(error);
  }
};
