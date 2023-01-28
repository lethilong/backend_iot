import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/rooms')
export class RoomController {
    constructor(
        private roomService: RoomService
    ) { }
    @Get('room-types')
    @ApiTags('Get all room types')
    async getAllRoomTypes(): Promise<ConfirmResponse> {
        return await this.roomService.getAllRoomTypes();
    }

    @Post('room-types')
    @ApiBody({ type: CreateRoomTypeDto })
    @ApiTags('Create a new room types')
    async createRoomType(@Body() data: CreateRoomTypeDto) {
        return await this.roomService.createRoomType(data);
    }

    @Post()
    @ApiBody({ type: CreateRoomDto })
    @ApiTags('Create a new room')
    async createRoom(@Req() req, @Body() data: CreateRoomDto) {
        return await this.roomService.createRoom(req.user.id, data)
    }

    @Get(':id')
    @ApiTags('Get room detail')
    async getRoomDetail(@Param('id') id: string) {
        return await this.roomService.getRoomDetail(id);
    }

    @Delete(':id')
    @ApiTags('Delete a room')
    async deleteRoom(@Req() req, @Param('id') id: string) {
        return await this.roomService.deleteRoom(req.user.id, id);
    }
}
