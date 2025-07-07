import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ApiError } from '../middlewares/error';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone } = req.body;
    const newUser = await authService.registerUser(email, password, name, phone);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Logged in successfully', user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);
    res.status(200).json({ message: 'Tokens refreshed successfully', accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};