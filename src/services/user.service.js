import { ApiError } from '../exeptions/api.error.js';
import { User } from '../models/user.js';
import { emailService } from '../services/email.service.js';
import { v4 as uuid } from 'uuid';

export async function getAllActivated() {
  return User.findOne({
    where: { activationToken: null },
  });
}

function normalize({ id, email }) {
  return { id, email };
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(email, password) {
  const activationToken = uuid;
  const existUser = await findByEmail(email);
  if (existUser) {
    throw ApiError.badRequest('User already exist', {
      email: 'User already exist',
    });
  }
  await User.create({ email, password, activationToken });

  await emailService.sendActivatationEmail(email, activationToken);
}

export const userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
};
