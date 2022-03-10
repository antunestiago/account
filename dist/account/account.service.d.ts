import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { AccountRepository } from './account.repository';
export interface AccountService {
    createAccount(createAccountDTO: CreateAccountDto): Promise<Account>;
}
export declare class AccountServiceImpl implements AccountService {
    private accountRepository;
    constructor(accountRepository: AccountRepository);
    createAccount(createAccountDTO: CreateAccountDto): Promise<Account>;
}
