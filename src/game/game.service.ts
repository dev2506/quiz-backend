import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class GameService {
    private waitingPlayers: Set<string> = new Set();
    removeWaitingPlayer(userId: string) {
        this.waitingPlayers.delete(userId)
    }
    async startGame(userId: string, socketId: string) {
        if (this.waitingPlayers.has(userId)) {
            throw new BadRequestException('User already in waiting queue')
        }
        const waitingPlayersLen = this.waitingPlayers.size
        if (waitingPlayersLen === 0) {
            this.waitingPlayers.add(userId)
            return null
        }
        const waitingPlayersArr = Array.from(this.waitingPlayers)
        const pairedPlayerUserId = waitingPlayersArr[0]
        this.waitingPlayers.delete(pairedPlayerUserId)
        return {
            opponent: pairedPlayerUserId
        }

    }
    async sendQuestion() {
        
    }
    async submitAnswer() {
        
    }

}