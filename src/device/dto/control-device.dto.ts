import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ControlDeviceDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    status: boolean;
}