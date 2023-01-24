import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>
  ) { }

  async createUser(user): Promise<User> {
    return await this.userModel.create(user);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ phone });
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ id });
    return user;
  }

  async updateUser(id, data) {
    const user = await this.userModel.findOneAndUpdate(id, data);
    return user
  }

}
