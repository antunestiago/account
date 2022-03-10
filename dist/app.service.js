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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let AppService = class AppService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    getHello() {
        return 'Hello World!';
    }
    async handlerEvents(eventMessage) {
        this.eventEmitter.emit(eventMessage['type'], eventMessage['payload']);
        return new Promise((resolve, reject) => {
            this.handleAccountEventsResponse(resolve, reject);
            setTimeout(() => {
                reject('Timeout error');
            }, 5000);
        });
    }
    handleAccountEventsResponse(resolve, reject) {
        this.eventEmitter.on('created_account', (payload) => {
            resolve(payload);
        });
        this.eventEmitter.on('account_error', (error) => {
            reject(error);
        });
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map