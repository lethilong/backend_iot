import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Room } from "src/room/schemas/room.schema";

@Schema({ timestamps: true })
export class Device {
    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DeviceType', required: true })
    type: Device;

    @Prop({
        type: [{
            message: { type: String },
            createdAt: { type: Date, default: Date.now() }
        }]
    })
    data: { message: string, createdAt: Date }[];

    @Prop({ type: Boolean, default: false })
    status;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
    room: Room;
}

export type DeviceDocument = Device & Document;
export const DeviceSchema = SchemaFactory.createForClass(Device);