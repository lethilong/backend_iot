import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomTypeSchema } from './schemas/roomType.schema';
import { RoomSchema } from './schemas/room.schema';
import { HomeModule } from 'src/home/home.module';

@Module({
  imports: [
    forwardRef(() => HomeModule),
    MongooseModule.forFeature([{ name: 'RoomType', schema: RoomTypeSchema }, { name: 'Room', schema: RoomSchema }])
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService]
})
export class RoomModule { }
