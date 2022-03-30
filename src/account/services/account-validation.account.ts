import { AccountValidationService } from "../account.interface";
import { Inject } from "@nestjs/common";
import { AccountDAO } from "../account.dao";

export class AccountValidationServiceImpl implements AccountValidationService {
  constructor(
    @Inject('AccountDAO') private accountDao: AccountDAO,
  ) {}

  async accountExists(document: string): Promise<boolean> {
    const account = await this.accountDao.findAccountByDocument(document);
    return Boolean(account);
  }

  async accountHasSufficientFunds(document: string, amount: number): Promise<boolean> {
    const sender = await this.accountDao.findAccountByDocument(document);
    return sender.availableLimit >= amount;
  }

}