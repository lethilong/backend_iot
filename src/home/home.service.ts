import { Injectable, Inject } from '@nestjs/common';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { forwardRef } from '@nestjs/common/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateHomeDto } from './dto/create-home.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { HomeDocument } from './home.schema';

@Injectable()
export class HomeService {
    constructor(
        @InjectModel('Home')
        private homeModel: Model<HomeDocument>,
        private userService: UserService,
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService
    ) { }

    async createHome(id, data: CreateHomeDto) {
        const homeData = {
            ...data,
            host: id,
        }
        const user = await this.userService.getUserById(id);
        const home = await this.homeModel.create(homeData);
        home.members.push(id);
        user.homes.push(home.id);
        await home.save();
        await user.save();
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async getHomes(id: string) {
        const homes = await this.userService.getUserHome(id);
        return new ConfirmResponse({
            data: {
                success: true,
                homes,
            }
        })
    }

    async addMember(id, homeId, data: AddMemberDto) {
        const home = await this.homeModel.findById(homeId);
        if (!home) {
            throw new NotFoundException('Home not existed');
        }
        if (home.host != id) {
            throw new ForbiddenException('Only host can add member')
        }
        const { phone } = data;
        const member = await this.userService.getUserByPhone(phone);
        if (!member) {
            throw new NotFoundException('User not existed');
        }
        if (member.homes.findIndex(home => home == homeId) != -1) {
            throw new BadRequestException('User already added as a member')
        }
        home.members.push(member.id);
        member.homes.push(homeId);
        await home.save();
        await member.save();
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async removeMember(id, homeId, data: RemoveMemberDto) {
        const home: any = await this.homeModel.findById(homeId);
        if (!home) {
            throw new NotFoundException('Home not existed');
        }
        if (home.host != id) {
            throw new ForbiddenException('Only host can remove member');
        }
        const memberId = data.id;
        if (home.host == memberId) {
            throw new BadRequestException('Cannot remove host');
        }
        const member = await this.userService.getUserById(memberId);
        if (!member) {
            throw new NotFoundException('Member not existed');
        }
        const index = member.homes.findIndex(home => home == homeId)
        if (index == -1) {
            throw new BadRequestException('Member not existed');
        }
        member.homes.splice(index, 1);
        await member.save();
        home.members.pull({ '_id': memberId });
        await home.save();
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async getHome(id, homeId) {
        const home: any = await this.homeModel.findById(homeId)
            .populate('members', 'name phone')
            .lean();
        if (!home) {
            throw new NotFoundException('Home not existed');
        }
        if (home.members.findIndex(member => member._id == id) == -1) {
            throw new ForbiddenException('Only member can get home information');
        }
        if (home.host == id) {
            home.isHost = true;
        } else {
            home.isHost = false;
        }
        const roomTypes = await this.roomService.getRooms(homeId);
        home.roomTypes = roomTypes;
        return new ConfirmResponse({
            data: {
                success: true,
                home,
            }
        })
    }

    async getHomeByHomeId(id) {
        return await this.homeModel.findById(id);
    }
}
