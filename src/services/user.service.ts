import { User } from "../models";
import { IUser } from "../types";

export class UserService {
  constructor(private readonly userDataSource = User) {}

  async createOne(data: IUser) {
    return this.userDataSource.create(data);
  }

  async findUserById(id: string) {
    return this.userDataSource.findById(id);
  }

  async findUserByEmail(email: string) {
    return await this.userDataSource.findOne({ email });
  }
  async findAll(query?: any, skip: number = 0, limit: number = 10000) {
    return this.userDataSource.find(query).skip(skip).limit(limit).exec();
  }
}

export const userService = new UserService();
