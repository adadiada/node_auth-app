import { User } from '../models/user.js';

import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';
import { tokenSerice } from '../services/token.service.js';

const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

function validateEmail(value) {
  if (!value) return 'Email is required';
  if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
}

function validatePassword(value) {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'At least 6 characters';
}

const register = async (req, res) => {
  const { email, password } = req.body;
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (errors.email || errors.password) {
    throw ApiError.badRequest('bad request', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);
  await userService.register(email, hashedPass);

  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await User.findOne({ where: { activationToken } });

  if (!user) {
    res.sendStatus(404);

    return;
  }
  user.activationToken = null;
  user.save();

  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw ApiError.badRequest('No such user');
  }

  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password');
  }
  await generateTokens(res, user);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userData = jwtService.verifyRefresh(refreshToken);
  const token = await tokenSerice.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized;
  }
  const user = await userService.findByEmail(userData.email);
  await generateTokens(res, user);
};

const generateTokens = async (res, user) => {
  const normalizeUser = userService.normalize(user);

  const accessTonken = jwtService.sign(normalizeUser);
  const refreshTonken = jwtService.signRefresh(normalizeUser);

  await tokenSerice.save(normalizeUser.id, refreshTonken);

  res.cookie('refreshTonken', refreshTonken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    HttpOnly: true,
  });
  res.send({
    user: normalizeUser,
    accessTonken,
  });
};

export const authContoller = {
  register,
  activate,
  login,
  refresh,
};
