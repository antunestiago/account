import { Inject, Injectable } from "@nestjs/common";
import { TransactionSaveService } from "../transaction.interface";
import { TransactionDAO } from "../transaction.dao";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { Account } from "../../account/entities/account.entity";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class SaveTransactionsImpl implements TransactionSaveService {

  constructor(
    @Inject('TransactionDAO') private transactionDAO: TransactionDAO,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, senderAccount: Account): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.senderDocument = createTransactionDto.senderDocument;
    transaction.receiverDocument = createTransactionDto.receiverDocument;
    transaction.availableLimit = senderAccount.availableLimit;
    transaction.datetime = createTransactionDto.datetime;

    return await this.transactionDAO.save(transaction);
  }
}