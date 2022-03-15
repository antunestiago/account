import { Transaction } from "./entities/transaction.entity";

export interface TransactionRepository {
  getAllSenderTransactions(document: string): Transaction[];
}

export class TransactionRepositoryImpl implements TransactionRepository{
  transactions: Transaction[] = [];

  getAllSenderTransactions(document: string): Transaction[] {
    return this.transactions.filter( t => t.senderDocument === document);
  }

}