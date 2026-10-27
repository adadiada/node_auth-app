// import { User } from '../models/user.js';
import { userService } from '../services/user.service.js';

const getAllActivated = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalize));
};

const updateProfile = async (req, res) => {
  const { name, oldPassword, newPassword, confirmation, password, newEmail } =
    req.body;
  const userId = req.user.id;

  if (name) {
    await userService.updateName(userId, name);
  }
  if (oldPassword && newPassword) {
    if (newPassword !== confirmation) {
      throw ApiError.badRequest('Passwords do not match');
    }
    await userService.updatePassword(userId, oldPassword, newPassword);
  }
  if (password && newEmail) {
    await userService.updateEmail(userId, password, newEmail);
  }

  res.send({ message: 'OK' });
};

export const userContoller = {
  getAllActivated,
  updateProfile,
};
