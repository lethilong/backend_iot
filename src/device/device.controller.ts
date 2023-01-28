import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { DeviceService } from './device.service';
import { ControlDeviceDto } from './dto/control-device.dto';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { CreateDeviceDto } from './dto/create-device.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/devices')
export class DeviceController {
    constructor(
        private deviceService: DeviceService
    ) { }

    @Get('device-types')
    @ApiTags('Get all device types')
    async getAllDeviceTypes() {
        return await this.deviceService.getAllDeviceTypes();
    }

    @Post('device-types')
    @ApiBody({ type: CreateDeviceTypeDto })
    @ApiTags('Create a new device types')
    async createRoomType(@Body() data: CreateDeviceTypeDto) {
        return await this.deviceService.createDeviceType(data);
    }
    @Post()
    @ApiBody({ type: CreateDeviceDto })
    @ApiTags('Create a new device')
    async createDevice(@Body() data: CreateDeviceDto) {
        return await this.deviceService.createDevice(data);
    }

    @Get(':id')
    @ApiTags('Get device detail')
    async getDeviceDetail(@Param('id') id: string) {
        return await this.deviceService.getDevice(id);
    }

    @Delete(':id')
    @ApiTags('Delete a device')
    async deleteDevice(@Param('id') id: string) {
        return await this.deviceService.deleteDevice(id);
    }

    @Patch(':id/control')
    async controlDevice(@Param('id') id: string, @Body() data: ControlDeviceDto) {
        return await this.deviceService.controlDevice(id, data);
    }
}
