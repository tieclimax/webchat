"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const socket_io_1 = require("socket.io");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    create(createMessegeDto, client) {
        const message = this.messagesService.create(createMessegeDto, client.id);
        this.server.emit('message', message);
        return message;
    }
    findAll() {
        return this.messagesService.findAll();
    }
    joinRoom(name, client) {
        this.server.emit('online', name);
        return this.messagesService.identify(name, client.id);
    }
    activeUsers() {
        return this.messagesService.clientToUser;
    }
    active(name, client) {
        this.messagesService.identify(name, client.id);
        this.server.emit('active_users', this.messagesService.clientToUser);
        client.on('disconnect', () => {
            this.messagesService.remove(client.id);
            this.server.emit('active_users', this.messagesService.clientToUser);
        });
        return 'connected';
    }
    async typing(isTyping, client) {
        const name = await this.messagesService.getClientName(client.id);
        client.broadcast.emit('typing', { name, isTyping });
    }
    async disconnect(name, client) {
        this.messagesService.remove(client.id);
        this.server.emit('active_users', this.messagesService.clientToUser);
        client.broadcast.emit('disconected', { name });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createMessege'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllMessages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)('name')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('current_users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "activeUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('active'),
    __param(0, (0, websockets_1.MessageBody)('name')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "active", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "typing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('goOffline'),
    __param(0, (0, websockets_1.MessageBody)('name')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "disconnect", null);
MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesGateway);
exports.MessagesGateway = MessagesGateway;
//# sourceMappingURL=messages.gateway.js.map