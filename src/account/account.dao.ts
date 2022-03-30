import { Account } from './entities/account.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";

export interface AccountDAO {
  save(account: Account): Promise<Account>;
  findAccountByDocument(document: string): Promise<Account>;
  updateAccounts(accounts: Account[]): Promise<Account[]>;
}

export class AccountRepositoryImpl implements AccountDAO {

  constructor(
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
  ) { }

  async save(account: Account): Promise<Account> {
    return await this.accountRepository.save(account);
  }

  async findAccountByDocument(document: string): Promise<Account> {
    return await this.accountRepository.createQueryBuilder("account")
      .where("account.document = :document", { document: document })
      .getOne();
  }

  async updateAccounts(accounts: Account[]): Promise<Account[]> {
    return await getManager().transaction(async transactionalEntityManager => {
      return await transactionalEntityManager.save(accounts)
    });
  }
}
