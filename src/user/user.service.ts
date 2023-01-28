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

  async createUser(user) {
    return await this.userModel.create(user);
  }

  async getUserByPhone(phone: string) {
    const user = await this.userModel.findOne({ phone });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async updateUser(id, data) {
    const user = await this.userModel.findOneAndUpdate({ id: id }, data);
    return user
  }

  async getUserHome(id) {
    const user: any = await this.userModel.findById(id)
      .populate({
        path: 'homes',
        select: { 'name': 1, 'address': 1, 'members': 1, 'host': 1 },
        populate: {
          path: 'members',
          select: { 'name': 1, 'phone': 1 }
        }
      })
      .lean();
    const homes = user?.homes;
    homes.forEach(home => {
      if (home.host == id) {
        home.isHost = true;
      } else {
        home.isHost = false;
      }
    })
    return homes;
  }
}
