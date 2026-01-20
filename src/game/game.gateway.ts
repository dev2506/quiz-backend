import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { READY_FOR_QUESTION, START_GAME, SUBMIT_ANSWER } from "src/constants/events";
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
            const payload = this.jwtService.verify(token);
            client.userId = payload.id;
            client.user = payload;
            this.socketIdToUserId.set(client.id, payload.id)
            this.userIdToSocketId.set(payload.id, client.id)
        } catch (err) {

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
            this.gameService.startGame(userId, client.id)
        } catch(err) {

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