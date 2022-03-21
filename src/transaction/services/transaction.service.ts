import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionDAO } from "../transaction.dao";
import { Transaction } from "../entities/transaction.entity";
import { ExceptionMessages } from "../../../common/exception-messages.enum";
import { TransactionSaveService, TransactionService, TransactionValidationService } from "../transaction.interface";
import { AccountService } from "../../account/services/account.service";
import { AccountTransactionService } from "../../account/account.interface";
import { Account } from "../../account/entities/account.entity";


@Injectable()
export class TransactionServiceImpl implements TransactionService {

  constructor(
    @Inject('AccountService') private accountService: AccountService,
    @Inject('AccountTransactionService') private accountTransactionService: AccountTransactionService,
    @Inject('TransactionSaveService') private transactionSaveService: TransactionSaveService,
    @Inject('TransactionValidationService') private transactionValidationService: TransactionValidationService,
  ) {}

  async transferFunds(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const result = await this.transactionValidationService.transactionIsValid(createTransactionDto);
    let senderAccount: Account;
    if (result) {
      senderAccount = await this.accountTransactionService.transferFundsBetweenAccounts(createTransactionDto.senderDocument,
        createTransactionDto.receiverDocument,
        createTransactionDto.value);
    }
    return await this.transactionSaveService.create(createTransactionDto, senderAccount);
    // transaction builder  (builder pattern)
    // save

  }
}

