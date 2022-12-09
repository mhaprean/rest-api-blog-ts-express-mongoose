
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {

  const currentUserId = req.userId;
  if (req.params.id === currentUserId) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted.');
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!')
  }
};
