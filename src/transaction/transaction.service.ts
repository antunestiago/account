import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AccountRepository } from "../account/account.repository";


export interface TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto): AccountAfterTransferFundsDto;
}

@Injectable()
export class TransactionImpl implements TransactionService {
  constructor(
    @Inject('AccountRepository') private accountRepository: AccountRepository,
  ) {}

  transferFunds(createTransactionDto: CreateTransactionDto): AccountAfterTransferFundsDto {
    if(!this.accountsExists(createTransactionDto)) {
      throw new BadRequestException({});
    }


    return  new AccountAfterTransferFundsDto();
  }

  private accountsExists(createTransactionDto: CreateTransactionDto) {
    const sender = this.accountRepository.findAccountByDocument(createTransactionDto.senderDocument);
    const receiver = this.accountRepository.findAccountByDocument(createTransactionDto.receiverDocument);
    return sender && receiver;
  }
}
