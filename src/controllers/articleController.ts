import { Request, Response, NextFunction } from 'express';
import Article, { IArticle } from '../models/Article';
import Joi from 'joi';

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await Article.find();

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
    });

    const { error } = joiSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error);
    }

    const { title, description } = req.body;
    const newArticle = { title, description, user: userId };
    const article = await Article.create(newArticle);

    return res.status(201).json(article);
  } catch (error) {
    return res.status(400).json(error);
  }
};
