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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const create_account_dto_1 = require("./dto/create-account.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const class_validator_1 = require("class-validator");
let AccountController = class AccountController {
    constructor(accountService, eventEmitter) {
        this.accountService = accountService;
        this.eventEmitter = eventEmitter;
    }
    async handleInitializeAccountEvent(payload) {
        console.log('initalize_account to: ', payload);
        const createAccountDto = this.mapToCreateAccountDto(payload);
        const errors = await (0, class_validator_1.validate)(createAccountDto);
        if (errors.length > 0) {
            this.eventEmitter.emit('account_error', errors);
            return errors;
        }
        return this.accountService
            .createAccount(createAccountDto)
            .then((response) => {
            this.eventEmitter.emit('created_account', response);
            return response;
        })
            .catch((err) => {
            this.eventEmitter.emit('account_error', err);
        });
    }
    mapToCreateAccountDto(payload) {
        const createAccountDto = new create_account_dto_1.CreateAccountDto();
        createAccountDto.name = payload.name;
        createAccountDto.document = payload.document;
        createAccountDto.availableLimit = payload.availableLimit;
        return createAccountDto;
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('initialize_account', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "handleInitializeAccountEvent", null);
AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __param(0, (0, common_1.Inject)('AccountService')),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map