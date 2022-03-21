import { Transaction } from "./entities/transaction.entity";
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

  async getAllSenderTransactions(document: string): Promise<Transaction[]> {
    return await this.transactionsRepository.find({ senderDocument: document })
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return await this.transactionsRepository.save(transaction);
  }

  async getLastSenderTransaction(senderDocument: string): Promise<Transaction> {
    return await this.transactionsRepository.createQueryBuilder("transaction")
      .where("transaction.senderDocument = :document", { document: senderDocument })
      .orderBy("transaction.datetime", "DESC")
      .getOne();
  }

}