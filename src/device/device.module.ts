import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceTypeSchema } from './schemas/deviceType.schema';
import { DeviceSchema } from './schemas/device.schema';
import { RoomModule } from 'src/room/room.module';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  imports: [
    MqttModule,
    RoomModule,
    MongooseModule.forFeature([{ name: 'DeviceType', schema: DeviceTypeSchema }, { name: 'Device', schema: DeviceSchema }])
  ],
  providers: [DeviceService],
  controllers: [DeviceController]
})
export class DeviceModule { }
