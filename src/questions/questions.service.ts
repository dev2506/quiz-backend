import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "./questions.repository";
import { QuestionWithoutId } from "./models/question.model";

@Injectable()
export class QuestionsService {
    
    constructor(
        private questionsRepository: QuestionsRepository
    ) {
        setTimeout(() => {
            this.populateQuestions()
        }, 5000)
    }

    async populateQuestions() {
        const questions: QuestionWithoutId[] = [
            new QuestionWithoutId("Capital of USA?", ["Budapest", "Washington", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of NZ?", ["Budapest", "Wellington", "Washington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Thailand?", ["Budapest", "Bangkok", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of South Korea?", ["Budapest", "Seoul", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Singapore?", ["Budapest", "Singapore", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Scotland?", ["Budapest", "Edinburgh", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Russia?", ["Budapest", "Moscow", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Poland?", ["Budapest", "Warsaw", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Norway?", ["Budapest", "Oslo", "Wellington", "Sydney"], 1, 2),
            new QuestionWithoutId("Capital of Germany?", ["Budapest", "Berlin", "Wellington", "Sydney"], 1, 2)
        ]
        return this.questionsRepository.bulkAdd(questions)
    }
    async getRandomQuestions(count: number) {
        return this.questionsRepository.getRandomQuestions(count)
    }
    async getQuestionById(questionId: string) {
        return this.questionsRepository.getQuestionById(questionId)
    }
}