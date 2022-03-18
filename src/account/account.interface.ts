import { Account } from "./entities/account.entity";

export interface AccountTransactionService {
  transferFundsBetweenAccounts(originAccountDoc: string, destinationAccountDoc: string, amount: number): Account;
}

export interface AccountValidationService {
  accountExists(document: string): boolean;
  accountHasSufficientFunds(document: string, amount: number): boolean;
}