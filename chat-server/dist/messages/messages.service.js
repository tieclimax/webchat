"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
let MessagesService = class MessagesService {
    constructor() {
        this.messages = [];
        this.clientToUser = {};
    }
    create(createMessageDto, clientId) {
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
    identify(name, clientId) {
        this.clientToUser[clientId] = name;
        return Object.keys(this.clientToUser);
    }
    getClientName(clientId) {
        return this.clientToUser[clientId];
    }
    remove(clientId) {
        const name = this.clientToUser[clientId];
        delete this.clientToUser[clientId];
        return name;
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map