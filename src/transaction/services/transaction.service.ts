import { Inject, Injectable } from "@nestjs/common";
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from "../entities/transaction.entity";
import { TransactionSaveService, TransactionService, TransactionValidationService } from "../transaction.interface";
import { AccountTransactionService } from "../../account/account.interface";
import { Account } from "../../account/entities/account.entity";


@Injectable()
export class TransactionServiceImpl implements TransactionService {

  constructor(
    @Inject('TransactionValidationService') private transactionValidationService: TransactionValidationService,
    @Inject('AccountTransactionService') private accountTransactionService: AccountTransactionService,
    @Inject('TransactionSaveService') private transactionSaveService: TransactionSaveService,
  ) {}

  async transferFunds(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // let senderAccount: Account;
    await this.transactionValidationService.transactionIsValid(createTransactionDto);

    // if (result) {
    const senderAccount = await this.accountTransactionService.transferFundsBetweenAccounts(createTransactionDto.senderDocument,
        createTransactionDto.receiverDocument,
        createTransactionDto.value)

    return await this.transactionSaveService.create(createTransactionDto, senderAccount);
    // transaction builder  (builder pattern)
    // save
  }
}

