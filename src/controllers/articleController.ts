import { Request, Response, NextFunction } from 'express';
import Article, { IArticle } from '../models/Article';
import Tag from '../models/Tag';
import Category from '../models/Category';
import Joi from 'joi';

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await Article.find().populate('user', 'name subscribers');

    return res.status(200).json(articles);
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

    if (article) {
      const deleteFromTags = await Tag.updateMany(
        { _id: article.tags },
        { $pull: { articles: article._id } }
      );

      const deleteFromCategory = await Category.findOneAndUpdate(
        { _id: article.category },
        { $pull: { articles: article._id } }
      );
    }

    await article?.remove();

    return res.status(200).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// TODO - create update logic for tags and category
