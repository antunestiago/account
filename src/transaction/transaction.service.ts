import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  transferFunds(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }
}
