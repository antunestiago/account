import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account } from "../entities/account.entity";
import { AccountDAO, } from "../account.dao";
import AccountBuilder from "../entities/account.builder";



export interface AccountService {
  createAccount(createAccountDTO: CreateAccountDto): Promise<Account>;
  getAccount(document: string): Promise<Account>;
}

@Injectable()
export class AccountServiceImpl implements AccountService {
  constructor(
    @Inject('AccountDAO') private accountDao: AccountDAO,
  ) {}

  async createAccount(createAccountDTO: CreateAccountDto): Promise<Account> {
    if (
      !await this.accountDao.findAccountByDocument(createAccountDTO.document)
    ) {
      const Account = new AccountBuilder(createAccountDTO.document)
        .setName(createAccountDTO.name)
        .setAvailableLimit(createAccountDTO.availableLimit)
        .build();

      return await this.accountDao.save(Account);
    }
    return new Promise((resolve, reject) => {
      const error = new ConflictException(
        createAccountDTO,
        'account_already_initialized',
      );
      reject(error);
    });
  }

  async getAccount(document: string): Promise<Account> {
    return await this.accountDao.findAccountByDocument(document);
  };
}
