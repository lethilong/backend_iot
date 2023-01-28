import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Device } from "src/device/schemas/device.schema";
import { Home } from "src/home/home.schema";
import { RoomType } from "./roomType.schema";

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Room {
    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true })
    type: RoomType;

    // @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Device' })
    // devices: Device[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true })
    home: Home;
}

export type RoomDocument = Room & Document;
const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.virtual('devices', {
    ref: 'Device',
    foreignField: 'room',
    localField: '_id',
});
export { RoomSchema };