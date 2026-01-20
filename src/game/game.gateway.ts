import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

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
        private jwtService: JwtService
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
        }
    }
}