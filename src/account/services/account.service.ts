import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account } from "../entities/account.entity";
import { AccountRepository } from "../account.repository";


export interface AccountService {
  createAccount(createAccountDTO: CreateAccountDto): Promise<Account>;
  getAccount(document: string): Account;
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
}
