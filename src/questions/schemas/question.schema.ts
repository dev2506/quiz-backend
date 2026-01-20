import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuestionDocument = HydratedDocument<Question>

@Schema({timestamps: true})
export class Question {
    @Prop({required: true})
    text: string

    @Prop({type: [String], required: true})
    choices: string[]

    @Prop({required: true})
    correctAnsIndex: number

    @Prop({default: 1})
    points: number
}

export const QuestionSchema = SchemaFactory.createForClass(Question)