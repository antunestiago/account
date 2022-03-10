import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

export interface AccountRepository {
  create(createAccountDto: CreateAccountDto): Promise<Account>;
  findAccountByDocument(document: string): Account;
}

export class AccountRepositoryImpl implements AccountRepository {
  accounts: Account[] = [];

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account: Account = new Account();
    account.name = createAccountDto.name;
    account.document = createAccountDto.document;
    account.availableLimit = createAccountDto.availableLimit;

    this.accounts.push(account);
    console.log('Accounts after new  creation: ', this.accounts);
    return new Promise<Account>((resolve) => resolve(account));
  }

  findAccountByDocument(document): Account {
    return this.accounts.find(
      (account: Account) => account.document === document,
    );
  }
}
