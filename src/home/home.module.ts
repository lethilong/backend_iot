import { forwardRef, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeSchema } from './home.schema';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => RoomModule),
    MongooseModule.forFeature([{ name: 'Home', schema: HomeSchema }])
  ],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [HomeService],
})
export class HomeModule { }
