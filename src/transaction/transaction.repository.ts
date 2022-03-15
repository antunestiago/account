import { Transaction } from "./entities/transaction.entity";

export interface TransactionRepository {
  getAllSenderTransactions(document: string): Transaction[];
  save(transaction: TransactionsDto): Transaction;
  getLastSenderTransaction(senderDocument: string): Transaction;
}

export class TransactionRepositoryImpl implements TransactionRepository{
  transactions: Transaction[] = [];

  getAllSenderTransactions(document: string): Transaction[] {
    return this.transactions.filter( t => t.senderDocument === document);
  }

  save(transaction: Transaction): Transaction {
    this.transactions.push(transaction);
    return transaction;
  }

  getLastSenderTransaction(senderDocument: string): Transaction {
    const allSenderTransaction = this.transactions.filter((acc => acc.senderDocument === senderDocument));
    allSenderTransaction.sort((a, b) => {
        if (a.datetime < b.datetime) return -1;
        if (a.datetime > b.datetime) return 1;
        return 0;
    });
    return allSenderTransaction.slice(-1)[0];
  }

}