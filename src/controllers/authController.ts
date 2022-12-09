import User, { IUser } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    return res.status(200).json({ success: 'User has been created!', user: newUser });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(404).json('User not found!');

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return res.status(400).json('Wrong Credentials!');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jwt_secret', {
      expiresIn: '1d',
    });
    const { password, ...others } = (user as any)._doc as IUser;

    return res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ user: others, access_token: token });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId;
    const user = await User.findById(id).select({"password": 0});

    return res.status(200).json({profile: user});
  } catch (error) {
    next(error);
  }
};

const authController = {
  register,
  login,
  profile,
};

export default authController;
