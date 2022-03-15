import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from "@nestjs/common";
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AccountService } from "../account/account.service";

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TransactionService') private readonly transactionService: TransactionService,
  ) {}

  @Post()
  transferFunds(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.transferFunds(createTransactionDto);
  }

}
