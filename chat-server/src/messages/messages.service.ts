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
      readed: Object.keys(this.clientToUser).length,
    };

    this.messages.push(message);

    // update old messages readed
    this.messages.forEach((message) => {
      message.readed = Object.keys(this.clientToUser).length;
    });

    return message;
  }

  findAll() {
    // update old messages readed
    this.messages.forEach((message) => {
      message.readed = Object.keys(this.clientToUser).length;
    });
    // delete messages every 10 minutes from messages.timestamp
    this.messages = this.messages.filter((message) => {
      const now = moment();
      const messageDate = moment(message.timestamp);
      const diff = now.diff(messageDate, 'minutes');
      if (diff > 10) {
        return false;
      }
      return true;
    });

    return this.messages;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.keys(this.clientToUser);
  }
  // checkOnline(message = 'ping', clientId: string) {
  //   // console.log(message, clientId);

  //   return message;
  // }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  remove(clientId: string) {
    const name = this.clientToUser[clientId];
    delete this.clientToUser[clientId];
    return name;
  }
}
