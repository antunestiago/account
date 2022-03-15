import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { AccountRepository } from './account.repository';
import { BusinessRuleError } from "../../common/filters/operational-error.filter";

export interface AccountService {
  createAccount(createAccountDTO: CreateAccountDto): Promise<Account>;
  getAccount(document: string): Account;
  transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number);
}

@Injectable()
export class AccountServiceImpl implements AccountService {
  constructor(
    @Inject('AccountRepository') private accountRepository: AccountRepository,
  ) {}

  async createAccount(createAccountDTO: CreateAccountDto): Promise<Account> {
    if (
      !this.accountRepository.findAccountByDocument(createAccountDTO.document)
    ) {
      return this.accountRepository.create(createAccountDTO);
    }
    return new Promise((resolve, reject) => {
      const error = new ConflictException(
        createAccountDTO,
        'account_already_initialized',
      );
      reject(error);
    });
  }

  getAccount(document: string): Account {
    return this.accountRepository.findAccountByDocument(document);
  };

  transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number) {
    const sender = {...this.accountRepository.findAccountByDocument(originAccountDoc)};
    const receiver = {...this.accountRepository.findAccountByDocument(destinationAccountDoc)};

    if (sender.availableLimit < amount) throw new BusinessRuleError(["Insufficient funds."]);

    try {
      sender.availableLimit = sender.availableLimit - amount;
      receiver.availableLimit = receiver.availableLimit + amount;

      this.accountRepository.updateAccount(sender);
      this.accountRepository.updateAccount(receiver);
    } catch (e) {
      throw e;
    }

    return sender;
  }

}
