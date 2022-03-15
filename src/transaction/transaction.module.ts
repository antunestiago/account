import { Module } from '@nestjs/common';
import { TransactionService, TransactionServiceImpl } from "./transaction.service";
import { TransactionController } from './transaction.controller';
import { AccountServiceImpl } from "../account/account.service";
import { TransactionRepositoryImpl } from "./transaction.repository";
import { AccountRepositoryImpl } from "../account/account.repository";
import { AccountModule } from "../account/account.module";


@Module({
  imports: [AccountModule],
  controllers: [TransactionController],
  providers: [
    { provide: 'TransactionService', useClass: TransactionServiceImpl },
    { provide: 'TransactionRepository', useClass: TransactionRepositoryImpl },
    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountRepository', useClass: AccountRepositoryImpl },
  ],
})
export class TransactionModule {}
