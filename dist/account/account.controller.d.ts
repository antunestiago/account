import { AccountService } from './account.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Account } from './entities/account.entity';
export declare class AccountController {
    private readonly accountService;
    private eventEmitter;
    constructor(accountService: AccountService, eventEmitter: EventEmitter2);
    handleInitializeAccountEvent(payload: any): Promise<void | Account | import("class-validator").ValidationError[]>;
    private mapToCreateAccountDto;
}
