import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret', (err, user) => {

      // if the token expired or is not valid we set the http status to 401 Unauthorized
      if (err) return res.status(401).json('Wrong or expired access token');
      if (user && typeof user !== 'string') {
        if (user.id) {
          req.userId = user.id;
          req.userRole = user.role;
        }
      }
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};
