import { AccountTransactionService } from "../account.interface";
import { Inject } from "@nestjs/common";

import { Account } from "../entities/account.entity";
import { BusinessRuleError } from "../../../common/filters/operational-error.filter";
import { AccountDAO } from "../account.dao";
import AccountBuilder from "../entities/account.builder";


export class AccountTransactionServiceImpl implements AccountTransactionService{
  constructor(
    @Inject('AccountDAO') private accountDao: AccountDAO,
  ) {}

  async transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number): Promise<Account> {
    const sender = await this.accountDao.findAccountByDocument(originAccountDoc);
    const receiver = await this.accountDao.findAccountByDocument(destinationAccountDoc);

    const newSender = new AccountBuilder(sender.document)
      .setName(sender.name)
      .setAvailableLimit(sender.availableLimit - amount).build();

    const newReceiver = new AccountBuilder(receiver.document)
      .setName(receiver.name)
      .setAvailableLimit(receiver.availableLimit + amount).build();

    try {
      await this.accountDao.updateAccounts([newSender, newReceiver]);
    } catch (e) {
      throw e;
    }
   return newSender;
  }


}