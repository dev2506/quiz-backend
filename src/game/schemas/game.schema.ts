import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose"

export type GameDocument = HydratedDocument<Game>

interface GameWinner {
    userId: string
    score: number
}

interface PlayerAnswer {
    questionId: string
    answer: string
    isCorrect: boolean
    answeredAt: Date
}

interface PlayerState {
    userId: string
    score: number
    currentQuestionIndex: number
    answers: PlayerAnswer[]
}

@Schema({ timestamps: true })
export class Game {
    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        required: true,
    })
    players: string[]

    @Prop({ type: Object, required: true })
    playerStates: Record<string, PlayerState>

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }],
        required: true,
    })
    questions: string[]

    @Prop({
        enum: ['waiting', 'active', 'completed'],
        default: 'waiting',
    })
    status: string;

    @Prop({ type: Object })
    winner: GameWinner
}

export const GameSchema = SchemaFactory.createForClass(Game)