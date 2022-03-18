import { AccountValidationService } from "../account.interface";
import { BusinessRuleError } from "../../../common/filters/operational-error.filter";
import { Inject } from "@nestjs/common";
import { AccountRepository } from "../account.repository";

export class AccountValidationServiceImpl implements AccountValidationService {
  constructor(
    @Inject('AccountRepository') private accountRepository: AccountRepository,
  ) {}

  accountExists(document: string): boolean {
    const sender = this.accountRepository.findAccountByDocument(document);
    return Boolean(sender);
  }

  accountHasSufficientFunds(document: string, amount: number): boolean {
    const sender = {...this.accountRepository.findAccountByDocument(document)};
    return sender.availableLimit >= amount;
  }

}