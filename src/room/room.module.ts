import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomTypeSchema } from './schemas/roomType.schema';
import { RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RoomType', schema: RoomTypeSchema }, { name: 'Room', schema: RoomSchema }])
  ],
  providers: [RoomService],
  controllers: [RoomController]
})
export class RoomModule { }
