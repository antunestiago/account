import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { BadRequestException, NotFoundException } from "@nestjs/common";

export interface AccountRepository {
  create(createAccountDto: CreateAccountDto): Promise<Account>;
  findAccountByDocument(document: string): Account;
  updateAccount(account: Account): Account;
}

export class AccountRepositoryImpl implements AccountRepository {
  accounts: Account[] = [{
    name: 'Teste 1',
    document: '000.000.000-00',
    availableLimit: 1000,
  },
    {
      name: 'Teste 2',
      document: '000.000.000-01',
      availableLimit: 200,
    }];

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

  updateAccount(account: Account): Account {
    let updatedAccount: Account = new Account();
    this.accounts.forEach(acc => {
      if (acc.document === account.document) {
        acc.availableLimit = account.availableLimit;
        updatedAccount = {...acc};
      }
    });

    if (updatedAccount) {
      return updatedAccount;
    } else {
      throw new NotFoundException({message: "Account not found."});
    }
  }
}
