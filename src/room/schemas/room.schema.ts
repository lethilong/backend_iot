import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { RoomType } from "./roomType.schema";

@Schema({ timestamps: true })
export class Room {
    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true })
    type: RoomType;
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);