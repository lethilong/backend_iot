import { IsEnum } from "class-validator";
import { StatusRequest } from "../enum/status-request.enum";

export class ReplyRequestDto {
    @IsEnum([StatusRequest.ACCEPTED, StatusRequest.REJECTED], {
        message: 'status must be Accepted or Rejected'
    })
    status: string;
}