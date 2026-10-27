import { usuariosApi } from '../features/usuarios/api/usuariosApi';
import { perfilApi } from '../features/perfil/api/perfilApi';
import type { User } from '../types';

/**
 * @deprecated Use `usuariosApi` from `features/usuarios` or `perfilApi` from `features/perfil` directly.
 */
export const usersService = {
  getUsers: usuariosApi.getUsers,
  getUserById: usuariosApi.getUserById,
  createUser: usuariosApi.createUser,
  updateUser: usuariosApi.updateUser,
  getProfile: perfilApi.getProfile,
  updateProfile: perfilApi.updateProfile,
  updateProfilePicture: perfilApi.updateProfilePicture,
  deleteProfilePicture: perfilApi.deleteProfilePicture,
  deleteUser: usuariosApi.deleteUser,
  activateUser: usuariosApi.activateUser,
};

export type { User };
