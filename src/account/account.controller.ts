import { Controller, Inject, PreconditionFailedException } from "@nestjs/common";
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { validate } from "class-validator";
import { Account } from './entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(
    @Inject('AccountService') private readonly accountService: AccountService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('initialize_account', { async: true })
  async handleInitializeAccountEvent(payload) {
    const createAccountDto = this.mapToCreateAccountDto(payload);

    const errors = await validate(createAccountDto);

    if (errors.length > 0) {
      const error = new PreconditionFailedException(errors, 'invalid_data');
      this.eventEmitter.emit('account_error', error);
      return error
    }

    return this.accountService //this is just returned for tests purpose
      .createAccount(createAccountDto)
      .then((response: Account) => {
        this.eventEmitter.emit('created_account', response);
        return response; //this is just returned for tests purpose
      })
      .catch((err) => {
        this.eventEmitter.emit('account_error', err);
        return err //this is just returned for tests purpose
      });
  }

  private mapToCreateAccountDto(payload) {
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    createAccountDto.name = payload.name;
    createAccountDto.document = payload.document;
    createAccountDto.availableLimit = payload.availableLimit;
    return createAccountDto;
  }
}
