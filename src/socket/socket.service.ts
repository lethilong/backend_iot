import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class SocketIO {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('join')
    joinUserToMeeting(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        client.join(data);
    }

    async sendNotification(userId: string, @MessageBody() content) {
        await this.server.to(userId).emit('notification', { content });
    }

    async sendRequest(userId: string, @MessageBody() content) {
        await this.server.to(userId).emit('request', { content });
    }
}