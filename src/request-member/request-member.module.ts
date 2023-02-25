import { Module } from '@nestjs/common';
import { RequestMemberService } from './request-member.service';
import { RequestMemberController } from './request-member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestMemberSchema } from './schema/request-member.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RequestMember', schema: RequestMemberSchema }])],
  providers: [RequestMemberService],
  controllers: [RequestMemberController],
  exports: [RequestMemberService]
})
export class RequestMemberModule { }
