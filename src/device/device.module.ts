import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceTypeSchema } from './schema/device-type.schema';
import { DeviceSchema } from './schema/device.schema';
import { RoomModule } from 'src/room/room.module';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  imports: [
    MqttModule,
    forwardRef(() => RoomModule),
    MongooseModule.forFeature([{ name: 'DeviceType', schema: DeviceTypeSchema }, { name: 'Device', schema: DeviceSchema }])
  ],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService]
})
export class DeviceModule { }
