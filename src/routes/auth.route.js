import express from 'express';
import { authContoller } from '../controllers/auth.conroller.js';
import { catchError } from '../utils/catchError.js';

export const authRouter = new express.Router();

authRouter.post('/registration', catchError(authContoller.register));
authRouter.get(
  '/activation/:activationToken',
  catchError,
  authContoller.activate,
);
authRouter.post('/login', catchError(authContoller.login));
console.log('login');
authRouter.post('/refresh', catchError(authContoller.refresh));
