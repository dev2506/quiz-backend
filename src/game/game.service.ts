import { BadRequestException, Injectable } from "@nestjs/common";
import { GameRepository } from "./repositories/game.repository";
import { Game } from "./models/game.model";
import { QuestionsService } from "src/questions/questions.service";
import { env } from "src/config/env";
import { Question } from "src/questions/models/question.model";

@Injectable()
export class GameService {
    private waitingPlayers: Set<string> = new Set();

    constructor(
        private gameRepository: GameRepository,
        private questionsService: QuestionsService
    ) {

    }
    removeWaitingPlayer(userId: string) {
        this.waitingPlayers.delete(userId)
    }

    async generateInitialGameData() {

    }
    async startGame(userId: string, socketId: string): Promise<
        { game: Game | null, opponent: string | null, questions: Question[] | null }> {
        if (this.waitingPlayers.has(userId)) {
            throw new BadRequestException('User already in waiting queue')
        }
        const waitingPlayersLen = this.waitingPlayers.size
        if (waitingPlayersLen === 0) {
            this.waitingPlayers.add(userId)
            return {
                game: null,
                opponent: null,
                questions: null
            }
        }

        const activeGame = await this.gameRepository.findByUserIdAndStatus(
            userId,
            ['waiting', 'active'],
        );
        console.log("Active Games", activeGame)
        if (activeGame) {
            throw new BadRequestException('User is already in an active game');
        }

        const waitingPlayersArr = Array.from(this.waitingPlayers)
        const pairedPlayerUserId = waitingPlayersArr[0]
        this.waitingPlayers.delete(pairedPlayerUserId)

        const questions = await this.questionsService.getRandomQuestions(env.NO_OF_RANDOM_QUESTIONS)
        const questionIds = questions.map(ele => ele.id)
        const newGame = await this.gameRepository.createGame({
            players: [userId, pairedPlayerUserId],
            playerStates: {
                [userId]: {
                    answers: [],
                    currentQuestionIndex: 0,
                    score: 0,
                    userId
                },
                [pairedPlayerUserId]: {
                    answers: [],
                    currentQuestionIndex: 0,
                    score: 0,
                    userId: pairedPlayerUserId
                }
            },
            questions: questionIds,
            status: 'active'
        })
        return {
            opponent: pairedPlayerUserId,
            game: newGame,
            questions
        }

    }
    async sendQuestion() {

    }
    async submitAnswer() {

    }

}