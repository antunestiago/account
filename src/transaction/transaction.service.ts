import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountService } from "../account/account.service";
import { TransactionRepository } from "./transaction.repository";


export interface TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto): AccountAfterTransferFundsDto;
}

@Injectable()
export class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject('AccountService') private accountService: AccountService,
    @Inject('TransactionRepository') private transactionRepository: TransactionRepository,
  ) {}

  transferFunds(createTransactionDto: CreateTransactionDto): AccountAfterTransferFundsDto {
    if(!this.accountsExists(createTransactionDto)) {
      throw new BadRequestException({});
    }

    if(!this.isNewTransaction(createTransactionDto)) {
      throw new BadRequestException({});
    }


    return  new AccountAfterTransferFundsDto();
  }

  private accountsExists(createTransactionDto: CreateTransactionDto): boolean {
    const sender = this.accountService.getAccount(createTransactionDto.senderDocument);
    const receiver = this.accountService.getAccount(createTransactionDto.receiverDocument);
    return Boolean(sender && receiver);
  }

  private isNewTransaction(createTransactionDto: CreateTransactionDto) {
    this.transactionRepository.getAllSenderTransactions(createTransactionDto.senderDocument)
    return false;
  }
}
