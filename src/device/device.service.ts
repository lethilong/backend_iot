import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { MqttService } from 'src/mqtt/mqtt.service';
import { RoomService } from 'src/room/room.service';
import { ControlDeviceDto } from './dto/control-device.dto';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDocument } from './schema/device.schema';
import { DeviceTypeDocument } from './schema/device-type.schema';

@Injectable()
export class DeviceService {
    constructor(
        @InjectModel('DeviceType')
        private deviceTypeModel: Model<DeviceTypeDocument>,
        @InjectModel('Device')
        private deviceModel: Model<DeviceDocument>,
        private roomService: RoomService,
        private mqttService: MqttService,
    ) { }
    async createDevice(data: CreateDeviceDto) {
        const { type, room } = data;
        const existedRoom = await this.roomService.getRoomById(room);
        if (!existedRoom) {
            throw new BadRequestException('Room not existed');
        }
        const deviceType = await this.deviceTypeModel.findById(type);
        if (!deviceType) {
            throw new BadRequestException('Device type not existed');
        }
        await this.deviceModel.create(data);
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async getDevice(id: string) {
        const device = await this.deviceModel.findById(id).populate('type', 'name');
        return new ConfirmResponse({
            data: {
                success: true,
                device,
            }
        })
    }

    async deleteDevice(id) {
        const device = await this.deviceModel.findById(id);
        if (!device) {
            throw new BadRequestException('Device not existed');
        }
        await this.deviceModel.findByIdAndDelete(id);
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async getAllDeviceTypes() {
        const deviceTypes = await this.deviceTypeModel.find().select('name');
        return new ConfirmResponse({
            data: {
                success: true,
                deviceTypes,
            }
        })
    }

    async createDeviceType(data: CreateDeviceTypeDto) {
        const { name } = data;
        const processedName = name.toLowerCase().replace(' ', '')
        const deviceType = await this.deviceTypeModel.findOne({ processedName });
        if (deviceType) {
            throw new BadRequestException('Device type already existed');
        }
        await this.deviceTypeModel.create({
            name,
            processedName,
        })
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async controlDevice(id, data: ControlDeviceDto) {
        const device = await this.deviceModel.findById(id);
        if (!device) {
            throw new BadRequestException('Device not existed');
        }
        // console.log({ ...device.control._doc, ...data });
        // await device.save();
        await this.deviceModel.findByIdAndUpdate(id, { control: data });
        this.mqttService.publish(process.env.MQTT_TOPIC_CONTROL, JSON.stringify({ control: data, deviceId: id }));
        return new ConfirmResponse({
            data: {
                success: true,
            }
        })
    }

    async getData(payload) {
        const { message, control, deviceId } = payload;
        const device = await this.deviceModel.findById(deviceId);
        if (device) {
            if (message) {
                device.data.unshift(message);
                await device.save();
            }

            if (control) {
                device.control = control;
                await device.save();
            }

        }
    }
}
