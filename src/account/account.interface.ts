import { Account } from "./entities/account.entity";

export interface AccountTransactionService {
  transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number): Promise<Account>;
}

export interface AccountValidationService {
  accountExists(document: string): Promise<boolean>;
  accountHasSufficientFunds(document: string, amount: number): Promise<boolean>;
}
