import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessege')
  create(
    @MessageBody() createMessegeDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.messagesService.create(createMessegeDto, client.id);

    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  // @SubscribeMessage('check_online')
  // checkOnline(@ConnectedSocket() client: Socket) {
  //   //  emit every 3 seconds to check user online
  // }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('online', name);

    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('current_users')
  activeUsers() {
    return this.messagesService.clientToUser;
  }

  @SubscribeMessage('active')
  active(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    this.messagesService.identify(name, client.id);
    this.server.emit('active_users', this.messagesService.clientToUser);
    client.on('disconnect', () => {
      this.messagesService.remove(client.id);
      this.server.emit('active_users', this.messagesService.clientToUser);
    });
    return 'connected';
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing', { name, isTyping });
  }

  @SubscribeMessage('goOffline')
  async disconnect(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.remove(client.id);
    this.server.emit('active_users', this.messagesService.clientToUser);
    client.broadcast.emit('disconected', { name });
  }
}
