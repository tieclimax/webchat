import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    messages: Message[];
    clientToUser: {};
    create(createMessageDto: CreateMessageDto, clientId: string): {
        name: any;
        text: string;
        color: string;
        timestamp: string;
        readed: number;
    };
    findAll(): Message[];
    identify(name: string, clientId: string): string[];
    getClientName(clientId: string): any;
    remove(clientId: string): any;
}
