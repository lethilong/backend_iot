import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetRequestsDto } from './dto/get-requests.dto';
import { RequestMemberService } from './request-member.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/request-member')
export class RequestMemberController {
    constructor(
        private requestMemberService: RequestMemberService
    ) { }
    @Get()
    @ApiTags('[REQUEST-MEMBER] Get all my requests')
    async getRequests(@Req() req, @Query() query: GetRequestsDto) {
        return await this.requestMemberService.getRequests(req.user.id, query);
    }
}
