import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GAME_WAITING, JOINED_GAME, READY_FOR_QUESTION, SEND_QUESTION, START_GAME, SUBMIT_ANSWER } from "src/constants/events";
import { GameService } from "./game.service";

interface AuthenticatedSocket extends Socket {
    userId?: string
    user?: any
}

@WebSocketGateway({
    namespace: '/game',
    cors: {
        origin: '*'
    }
})
@Injectable()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wsServer: Server

    private socketIdToUserId: Map<string, string> = new Map();
    private userIdToSocketId: Map<string, string> = new Map();

    constructor(
        private jwtService: JwtService,
        private gameService: GameService
    ) {
    }
    async handleConnection(client: AuthenticatedSocket) {
        try {
            const token = client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                ignoreExpiration: false,

            });
            client.userId = payload.id;
            client.user = payload;
            if (!this.userIdToSocketId.get(payload.id)) {
                this.socketIdToUserId.set(client.id, payload.id)
                this.userIdToSocketId.set(payload.id, client.id)
            }
        } catch (err) {
            client.disconnect()
        }
    }
    async handleDisconnect(client: AuthenticatedSocket) {
        const userId = this.socketIdToUserId.get(client.id);
        if (userId) {
            this.socketIdToUserId.delete(client.id);
            this.userIdToSocketId.delete(userId);
            this.gameService.removeWaitingPlayer(userId)
        }
    }

    private getUserIdFromSocket(client: Socket) {
        const userId = this.socketIdToUserId.get(client.id)
        if (!userId) {
            throw new UnauthorizedException('User not authenticated!!')
        }
        return userId
    }

    @SubscribeMessage(START_GAME)
    async startGame(
        @ConnectedSocket() client: Socket
    ) {
        try {
            const userId = this.getUserIdFromSocket(client)
            const startGameRes = await this.gameService.startGame(userId, client.id)
            if (!startGameRes.opponent) {
                client.emit(GAME_WAITING, {
                    message: "Waiting for opponent",
                    isError: false
                })
                return
            }
            
            const initialGameData = {
                gameId: startGameRes.game?.id,
                totalQuestions: startGameRes.game?.questions,
                players: startGameRes.game?.players,
                currentQuestionNumber: 1
            }
            const user1WsId = this.userIdToSocketId.get(userId)
            const user2WsId = this.userIdToSocketId.get(startGameRes.opponent)
            if (user1WsId) {
                this.wsServer.to(user1WsId).emit(JOINED_GAME, initialGameData)
            }
            if (user2WsId) {
                this.wsServer.to(user2WsId).emit(JOINED_GAME, initialGameData)
            }
            const firstQuestion = startGameRes.questions?.[0]
            if (firstQuestion && user1WsId) {
                this.wsServer.to(user1WsId).emit(SEND_QUESTION, {
                    questionIndex: 0,
                    question: {
                        id: firstQuestion.id,
                        text: firstQuestion.text,
                        choices: firstQuestion.choices,
                        points: firstQuestion.points,
                    }
                })
            }
            if (firstQuestion && user2WsId) {
                this.wsServer.to(user2WsId).emit(SEND_QUESTION, {
                    questionIndex: 0,
                    question: {
                        id: firstQuestion.id,
                        text: firstQuestion.text,
                        choices: firstQuestion.choices,
                        points: firstQuestion.points,
                    }
                })
            }
        } catch(err) {
            client.emit(GAME_WAITING, {
                message: "Already in waiting queue",
                isError: false
            })
        }
    }
    @SubscribeMessage(READY_FOR_QUESTION)
    async sendQuestion(
        @ConnectedSocket() client: Socket
    ) {
        try {
            const userId = this.getUserIdFromSocket(client)
            this.gameService.sendQuestion()
        } catch(err) {

        }
    }

    @SubscribeMessage(SUBMIT_ANSWER)
    async submitAnswer(
        @ConnectedSocket() client: Socket
    ) {
        try {
            const userId = this.getUserIdFromSocket(client)
            this.gameService.submitAnswer()
        } catch(err) {

        }
    }
}