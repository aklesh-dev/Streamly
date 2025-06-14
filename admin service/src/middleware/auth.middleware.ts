import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import "dotenv/config";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
};

export const isAdminAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.token as string;
    if(!token) {
      res.status(403).json({ message: 'Unauthorized - Token is missing' });
      return;
    }
    const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/me`, {
      headers: {
        token,
      },
    });
    req.user = data.user;
    next();

  } catch (error) {
    res.status(403).json({ message: ' Unauthorized - Token is invalid' });
    return;
  }
};