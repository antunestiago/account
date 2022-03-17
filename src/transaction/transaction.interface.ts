import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Transaction } from "./entities/transaction.entity";
import { Account } from "../account/entities/account.entity";

export interface TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
}

export interface TransactionSaveService {
  create(createTransactionDto: CreateTransactionDto, senderAccount: Account): Promise<Transaction>;
}