import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser, User } from '../Model.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
};

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.token as string;
    if(!token) {
      res.status(403).json({message: "Unauthorized - No token provided"});
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    if(!decoded || !decoded.userId) {
      res.status(403).json({message: "Unauthorized - Invalid token"});
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user) {
      res.status(403).json({message: "Unauthorized - User not found"});
      return;
    }

    req.user = user;

    next();
    
  } catch (error) {
    res.status(403).json({ message: 'Not authorized' });
    console.error("Error in auth middleware: ", error);
    return;
  }
};