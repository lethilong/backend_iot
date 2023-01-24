import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('api')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    @Post('register')
    async register(@Body() user): Promise<ConfirmResponse> {
        return await this.authService.register(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req): Promise<ConfirmResponse> {
        return await this.authService.login(req.user);
    }
}
