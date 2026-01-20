import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "./questions.repository";

@Injectable()
export class QuestionsService {
    constructor(
        private questionsRepository: QuestionsRepository
    ) {
    }
    async getRandomQuestions(count: number) {
        return this.questionsRepository.getRandomQuestions(count)
    }
}