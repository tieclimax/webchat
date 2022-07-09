import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket, Server } from 'socket.io';
export declare class MessagesGateway {
    private readonly messagesService;
    server: Server;
    constructor(messagesService: MessagesService);
    create(createMessegeDto: CreateMessageDto, client: Socket): {
        name: any;
        text: string;
        color: string;
        timestamp: string;
    };
    findAll(): import("./entities/message.entity").Message[];
    joinRoom(name: string, client: Socket): string[];
    activeUsers(): {};
    active(name: string, client: Socket): string;
    typing(isTyping: boolean, client: Socket): Promise<void>;
    disconnect(name: string, client: Socket): Promise<void>;
}
