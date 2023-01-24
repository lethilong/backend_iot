import { Body, Controller, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { HomeService } from './home.service';

@UseGuards(JwtAuthGuard)
@Controller('api/homes')
export class HomeController {
    constructor(
        private homeService: HomeService
    ) { }
    @Post()
    async createHome(@Req() req, @Body() data): Promise<ConfirmResponse> {
        return await this.homeService.createHome(req.user.id, data);
    }
}
