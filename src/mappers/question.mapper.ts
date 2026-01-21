import { Question } from "src/questions/models/question.model";
import { QuestionDocument } from "src/questions/schemas/question.schema";

export class QuestionMapper {
    public static toDomain(doc: QuestionDocument): Question {
        return new Question(
            doc._id.toString(),
            doc.text,
            doc.choices,
            doc.correctAnsIndex,
            doc.points
        );
    }
    public static toDomainOptional(doc: QuestionDocument | null): Question | null {
        return doc ? this.toDomain(doc) : null
    }
    public static toDomainArray(questionDocs: QuestionDocument[]): Question[] {
        return questionDocs.map((doc) => this.toDomain(doc))
    }
}