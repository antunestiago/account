import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountService } from "../account/account.service";
import { TransactionRepository } from "./transaction.repository";
import { DataValidationError } from "../../common/filters/operational-error.filter";
import { Transaction } from "./entities/transaction.entity";


export interface TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto): TransactionsDto;
}

@Injectable()
export class TransactionServiceImpl implements TransactionService {
  TWO_MINUTES_IN_SECONDS = 120;

  constructor(
    @Inject('AccountService') private accountService: AccountService,
    @Inject('TransactionRepository') private transactionRepository: TransactionRepository,
  ) {}

  transferFunds(createTransactionDto: CreateTransactionDto): TransactionsDto {
    if(!this.accountsExists(createTransactionDto)) {
      throw new NotFoundException({message: "One or both accounts does not exists"})
      // throw new DataValidationError(["one or both accounts does not exists"])

    }

    if(!this.isNewTransaction(createTransactionDto)) {
      throw new BadRequestException({message:"Double transaction"});
    }

    const senderAccount = this.accountService.transferFundsBetweenAccounts(createTransactionDto.senderDocument,
      createTransactionDto.receiverDocument,
      createTransactionDto.value);

    return this.saveTransaction(createTransactionDto, senderAccount);
  }

  private saveTransaction(createTransactionDto: CreateTransactionDto, senderAccount): Transaction {
    const transaction = new Transaction();
    transaction.senderDocument = createTransactionDto.senderDocument;
    transaction.receiverDocument = createTransactionDto.receiverDocument;
    transaction.availableLimit = senderAccount.availableLimit;
    transaction.datetime = createTransactionDto.datetime;

    return this.transactionRepository.save(transaction);
  }

  private accountsExists(createTransactionDto: CreateTransactionDto): boolean {
    const sender = this.accountService.getAccount(createTransactionDto.senderDocument);
    const receiver = this.accountService.getAccount(createTransactionDto.receiverDocument);
    return Boolean(sender && receiver);
  }

  private isNewTransaction(createTransactionDto: CreateTransactionDto) {
    const lastSenderTransaction = this.transactionRepository.getLastSenderTransaction(createTransactionDto.senderDocument)

    if (!lastSenderTransaction) return true;

    const diff = createTransactionDto.datetime.getTime() - lastSenderTransaction.datetime.getTime();
    return diff/1000 > this.TWO_MINUTES_IN_SECONDS;
  }
}
