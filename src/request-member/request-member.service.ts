import { BadRequestException, ForbiddenException, forwardRef, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { HomeService } from 'src/home/home.service';
import { UserService } from 'src/user/user.service';
import { GetRequestsDto } from './dto/get-requests.dto';
import { ReplyRequestDto } from './dto/reply-request.dto';
import { StatusRequest } from './enum/status-request.enum';
import { RequestMemberDocument } from './schema/request-member.schema';

@Injectable()
export class RequestMemberService {
    constructor(
        @InjectModel('RequestMember')
        private requestMemberModel: Model<RequestMemberDocument>,
        @Inject(forwardRef(() => HomeService))
        private homeService: HomeService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }

    async getRequests(id, data: GetRequestsDto) {
        const { pageSize = 10, pageNumber = 1, status } = data;
        const findOption = status ? { to: id, status: status } : { to: id }
        const requests = await this.requestMemberModel.find(findOption).select('from home status').skip(pageSize * (pageNumber - 1)).limit(pageSize).populate('from', 'name phone').populate('home', 'name address');
        const total = await this.requestMemberModel.count(findOption);
        return new ConfirmResponse({
            data: {
                success: true,
                requests,
                total,
            }
        })
    }

    async createRequest(data) {
        return await this.requestMemberModel.create(data);
    }

    async getRequest(data) {
        return await this.requestMemberModel.findOne(data);
    }

    async replyRequest(userId, id, data: ReplyRequestDto) {
        const { status } = data;
        const request = await this.requestMemberModel.findById(id);
        if (!request) {
            throw new BadRequestException('Request member not existed');
        }
        if (request.status != StatusRequest.PENDING) {
            throw new BadRequestException('Can not reply this request');
        }
        if (request.to != userId) {
            throw new ForbiddenException('Not have permission to do this action')
        }
        const user = await this.userService.getUserById(userId);
        const home = await this.homeService.getHomeByHomeId(request.home);
        if (!user || !home) {
            throw new BadRequestException('Something went wrong');
        }
        if (status == StatusRequest.ACCEPTED) {
            home.members.push(userId);
            user.homes.push(request.home);
            await home.save();
            await user.save();
        }
        request.status = status;
        await request.save();

        return new ConfirmResponse({
            data: {
                success: true,
            }
        })

    }
}