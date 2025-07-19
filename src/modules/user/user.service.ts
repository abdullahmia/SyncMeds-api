import userRepository from "./user.repository";
import { PublicUser } from "./user.types";

export class UserService {
  constructor() {}

  async getUsers(): Promise<PublicUser[]> {
    return await userRepository.getUsers();
  }
}

export default new UserService();
