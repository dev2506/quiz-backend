import { BadRequestException, Injectable } from "@nestjs/common";
import { GameRepository } from "./repositories/game.repository";
import { Game } from "./models/game.model";

@Injectable()
export class GameService {
    private waitingPlayers: Set<string> = new Set();

    constructor(
        private gameRepository: GameRepository
    ) {
        
    }
    removeWaitingPlayer(userId: string) {
        this.waitingPlayers.delete(userId)
    }
    async startGame(userId: string, socketId: string): Promise<
        {game: Game | null, opponent: string | null}> {
        if (this.waitingPlayers.has(userId)) {
            throw new BadRequestException('User already in waiting queue')
        }
        const waitingPlayersLen = this.waitingPlayers.size
        if (waitingPlayersLen === 0) {
            this.waitingPlayers.add(userId)
            return {
                game: null,
                opponent: null
            }
        }
        const waitingPlayersArr = Array.from(this.waitingPlayers)
        const pairedPlayerUserId = waitingPlayersArr[0]
        this.waitingPlayers.delete(pairedPlayerUserId)
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
            questions: [],
            status: 'active'
        })
        return {
            opponent: pairedPlayerUserId,
            game: newGame
        }

    }
    async sendQuestion() {
        
    }
    async submitAnswer() {
        
    }

}