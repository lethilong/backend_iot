import { forwardRef, Module } from '@nestjs/common';
import { RequestMemberService } from './request-member.service';
import { RequestMemberController } from './request-member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestMemberSchema } from './schema/request-member.schema';
import { HomeModule } from 'src/home/home.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => HomeModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'RequestMember', schema: RequestMemberSchema }])
  ],
  providers: [RequestMemberService],
  controllers: [RequestMemberController],
  exports: [RequestMemberService]
})
export class RequestMemberModule { }
