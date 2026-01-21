import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
    async sendQuestion(userId: string) {

    }
    async submitAnswer(
        game: Game,
        userId: string,
        answer: number
    ) {
        const playerState = game.playerStates[userId]
        const questionIndex = playerState.currentQuestionIndex
        if (questionIndex >= game.questions.length) {
            throw new BadRequestException('Invalid question index');
        }
        if (playerState.answers.length - 1 >= questionIndex) {
            throw new BadRequestException('Already answered')
        }
        const question = await this.questionsService.getQuestionById(game.questions[questionIndex])
        if (!question) {
            throw new NotFoundException('Question not found');
        }
        const isCorrect = question.correctAnsIndex === answer
        playerState.answers.push({ isCorrect, answeredAt: new Date(), questionId: question.id, answer })
        if (isCorrect) {
            playerState.score += question.points
        }
        playerState.currentQuestionIndex = questionIndex + 1
        await this.gameRepository.save(game)
        const bothPlayersComplete = Object.values(game.playerStates).every(
            (state) => state.currentQuestionIndex >= game.questions.length,
        )
        if (bothPlayersComplete) {
            await this.endGame(game)
            const updatedGameSession = await this.getGameById(game.id)

            return {
                game: updatedGameSession,
                isCorrect,
                nextQuestionIndex: playerState.currentQuestionIndex,
                isGameComplete: true,
            };
        }

        return {
            game,
            isCorrect,
            nextQuestionIndex: playerState.currentQuestionIndex,
            isGameComplete: false,
        };
    }

    async endGame(game: Game) {
        const playerScores = Object.values(game.playerStates).map(
            (state) => ({
                userId: state.userId,
                score: state.score,
            }),
        )
        playerScores.sort((a, b) => b.score - a.score)
        if (playerScores[0].score > playerScores[1].score) {
            game.winner = playerScores[0];
        } else if (playerScores[0].score === playerScores[1].score) {
            game.winner = null
        }
        game.status = 'completed'
        return this.gameRepository.save(game)
    }

    async getGameById(gameId: string): Promise<Game> {
        const game = await this.gameRepository.findById(gameId)
        if (!game) {
            throw new NotFoundException('Game not found')
        }
        return game;
    }

    async findByUserIdAndStatus(userId: string, statuses: string[]) {
        const activeGame = await this.gameRepository.findByUserIdAndStatus(
            userId,
            ['waiting', 'active'],
        );
        return activeGame
    }

}