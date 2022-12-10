import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


declare global {
  namespace Express {
    export interface Request {
       userId?: string;
    }
  }
} 

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret', (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      if (user && typeof user !== 'string') {
        if (user.id) {
          req.userId = user.id;
        }
      }
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};