import { AccountTransactionService } from "../account.interface";
import { Inject } from "@nestjs/common";
import { AccountRepository } from "../account.repository";
import { Account } from "../entities/account.entity";
import { BusinessRuleError } from "../../../common/filters/operational-error.filter";

export class AccountTransactionServiceImpl implements AccountTransactionService{
  constructor(
    @Inject('AccountRepository') private accountRepository: AccountRepository,
  ) {}

  transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number): Account {
    const sender = {...this.accountRepository.findAccountByDocument(originAccountDoc)};
    const receiver = {...this.accountRepository.findAccountByDocument(destinationAccountDoc)};

    try {
      sender.availableLimit = sender.availableLimit - amount;
      receiver.availableLimit = receiver.availableLimit + amount;

      this.accountRepository.updateAccount(sender);
      this.accountRepository.updateAccount(receiver);
    } catch (e) {
      //
      throw e;
    }

    return sender;
  }


}