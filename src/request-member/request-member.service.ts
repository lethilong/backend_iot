import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { GetRequestsDto } from './dto/get-requests.dto';
import { RequestMemberDocument } from './schema/request-member.schema';

@Injectable()
export class RequestMemberService {
    constructor(
        @InjectModel('RequestMember')
        private requestMemberModel: Model<RequestMemberDocument>
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
}
