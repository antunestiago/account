import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountService } from "../account/account.service";
import { TransactionDAO } from "./transaction.dao";
import { Transaction } from "./entities/transaction.entity";
import { ExceptionMessages } from "../../common/exception-messages.enum";


export interface TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
}

@Injectable()
export class TransactionServiceImpl implements TransactionService {
  TWO_MINUTES_IN_SECONDS = 120;

  constructor(
    @Inject('AccountService') private accountService: AccountService,
    @Inject('TransactionDAO') private transactionDAO: TransactionDAO,
  ) {}

  async transferFunds(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    if (!this.accountsExists(createTransactionDto)) {
      throw new NotFoundException({ message: ExceptionMessages.noAccountFound })
      // throw new DataValidationError(["one or both accounts does not exists"])
    }

    if (!await this.isNewTransaction(createTransactionDto)) {
      throw new BadRequestException({ message: ExceptionMessages.doubleTransaction });
    }

    const senderAccount = this.accountService.transferFundsBetweenAccounts(createTransactionDto.senderDocument,
      createTransactionDto.receiverDocument,
      createTransactionDto.value);

    return await this.saveTransaction(createTransactionDto, senderAccount);
  }

  private async saveTransaction(createTransactionDto: CreateTransactionDto, senderAccount): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.senderDocument = createTransactionDto.senderDocument;
    transaction.receiverDocument = createTransactionDto.receiverDocument;
    transaction.availableLimit = senderAccount.availableLimit;
    transaction.datetime = createTransactionDto.datetime;

    return await this.transactionDAO.save(transaction);
  }

  private accountsExists(createTransactionDto: CreateTransactionDto): boolean {
    const sender = this.accountService.getAccount(createTransactionDto.senderDocument);
    const receiver = this.accountService.getAccount(createTransactionDto.receiverDocument);
    return Boolean(sender && receiver);
  }

  private async isNewTransaction(createTransactionDto: CreateTransactionDto) {
    const lastSenderTransaction = await this.transactionDAO.getLastSenderTransaction(createTransactionDto.senderDocument)

    if (!lastSenderTransaction) return true;

    const diff = createTransactionDto.datetime.getTime() - lastSenderTransaction.datetime.getTime();
    return Math.abs(diff) / 1000 > this.TWO_MINUTES_IN_SECONDS;
  }
}
