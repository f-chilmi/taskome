import { User } from "../models";
import { IUser } from "../types";

export class UserService {
  constructor(private readonly userDataSource = User) {}

  async createOne(data: IUser) {
    return this.userDataSource.create(data);
  }

  async findUserById(id: string) {
    return this.userDataSource.findOne({ id });
  }

  async findUserByEmail(email: string) {
    return await this.userDataSource.findOne({ email });
  }
}

export const userService = new UserService();
