import { Controller, Post, Body, Inject } from "@nestjs/common";

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from "./transaction.interface";

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TransactionService') private readonly transactionService: TransactionService,
  ) {}

  @Post()
  async transferFunds(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.transferFunds(createTransactionDto);
  }

}
