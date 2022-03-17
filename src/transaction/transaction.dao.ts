import { Transaction } from "./entities/transaction.entity";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export interface TransactionDAO {
  getAllSenderTransactions(document: string): Promise<Transaction[]>;
  save(transaction: TransactionsDto): Promise<Transaction>;
  getLastSenderTransaction(senderDocument: string): Promise<Transaction>;
}

export class TransactionRepositoryImpl implements TransactionDAO{

  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
  ) { }

  // transactions: Transaction[] = [];

  async getAllSenderTransactions(document: string): Promise<Transaction[]> {
    // return this.transactions.filter( t => t.senderDocument === document);
    return await this.transactionsRepository.find({ senderDocument: document })
  }

  async save(transaction: Transaction): Promise<Transaction> {

    return await this.transactionsRepository.save(transaction);

    // this.transactions.push(transaction);
    // return transaction;
  }

  async getLastSenderTransaction(senderDocument: string): Promise<Transaction> {
    //
    // const allSenderTransaction = this.transactions.filter((acc => acc.senderDocument === senderDocument));
    // allSenderTransaction.sort((a, b) => {
    //     if (a.datetime < b.datetime) return -1;
    //     if (a.datetime > b.datetime) return 1;
    //     return 0;
    // });
    // return allSenderTransaction.slice(-1)[0];
    return await this.transactionsRepository.createQueryBuilder("transaction")
      .where("transaction.senderDocument = :document", { document: senderDocument })
      .orderBy("transaction.datetime", "DESC")
      .getOne();

  }

}