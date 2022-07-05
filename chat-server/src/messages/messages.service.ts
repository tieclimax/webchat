import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import * as moment from 'moment';
@Injectable()
export class MessagesService {
  messages: Message[] = [];
  clientToUser = {};
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
      color: createMessageDto.color,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.keys(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
  // disconnected(clientId: string) {
  //   delete this.clientToUser[clientId];
  //   console.log(this.clientToUser);

  //   return true;
  // }
  remove(clientId: string) {
    const name = this.clientToUser[clientId];
    delete this.clientToUser[clientId];
    return name;
  }
}
