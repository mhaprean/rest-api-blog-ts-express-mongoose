import { Request, Response, NextFunction } from 'express';
import Tag, { ITag } from '../models/Tag';
import Joi from 'joi';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await Tag.find();

    return res.status(200).json(tags);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTagById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const tag = await Tag.findById(id);

    return res.status(200).json(tag);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createTag = async (
  req: Request<{}, {}, ITag>,
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
    const newcTag = { title };
    const tag = await Tag.create(newcTag);

    return res.status(201).json(tag);
  } catch (error) {
    return res.status(400).json(error);
  }
};
