import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Room } from "src/room/schemas/room.schema";
import { User } from "src/user/user.schema";

@Schema({ timestamps: true })
export class Home {
    @Prop({ required: true })
    name: string;

    @Prop()
    address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    host: User;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Room' })
    rooms: Room[];
}

export type HomeDocument = Home & Document;
export const HomeSchema = SchemaFactory.createForClass(Home);