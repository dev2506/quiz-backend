import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {
    @Prop()
    name: string
    @Prop()
    email: string
    @Prop()
    password: string
    createdAt: Date
    updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);