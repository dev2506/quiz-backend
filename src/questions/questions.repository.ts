import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuestionDocument, Question as QuestionSchema } from "./schemas/question.schema";
import { Model } from "mongoose";
import { Question } from "./models/question.model";
import { QuestionMapper } from "src/mappers/question.mapper";

@Injectable()
export class QuestionsRepository {
    constructor(
        @InjectModel(QuestionSchema.name) private questionModel: Model<QuestionDocument>,
    ) {
    }
    async getRandomQuestions(count: number): Promise<Question[]> {
        const questionDocs = await this.questionModel
            .aggregate([{ $sample: { size: count } }])
            .exec();
        return QuestionMapper.toDomainArray(questionDocs)
    }
}