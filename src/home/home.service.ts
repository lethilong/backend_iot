import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { UserService } from 'src/user/user.service';
import { HomeDocument } from './home.schema';

@Injectable()
export class HomeService {
    constructor(
        @InjectModel('Home')
        private homeModel: Model<HomeDocument>,
        private userService: UserService,
    ) { }

    async createHome(id, data) {
        const homeData = {
            ...data,
            host: id,
        }
        const user = await this.userService.getUserById(id);
        const home = await this.homeModel.create(homeData);
        if (!user.homes) {
            user.homes = [];
        }
        user.homes.push(home.id);
        await this.userService.updateUser(id, user);
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })


    }
}
