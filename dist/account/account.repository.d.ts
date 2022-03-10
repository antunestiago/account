import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
export interface AccountRepository {
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findAccountByDocument(document: string): Account;
}
export declare class AccountRepositoryImpl implements AccountRepository {
    accounts: Account[];
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findAccountByDocument(document: any): Account;
}
