import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/Category';
import Joi from 'joi';
import Article from '../models/Article';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const category = await Category.findById(id);

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createCategory = async (
  req: Request<{}, {}, ICategory>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const joiSchema = Joi.object({
      title: Joi.string().min(3).max(60).required(),
    });

    const { error } = joiSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error);
    }

    const { title } = req.body;
    const newcategory = { title };
    const category = await Category.create(newcategory);

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCategoryArticles = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const articles = await Article.find({
      category: id,
    }).populate([
      { path: 'category', select: '_id title' },
      { path: 'user', select: ['_id', 'name', 'image'] },
      { path: 'tags', select: '_id title' },
    ]);
    return res.status(200).json(articles);
  } catch (error) {}
};
