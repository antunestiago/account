import { Module } from '@nestjs/common';
import { TransactionServiceImpl } from "./services/transaction.service";
import { TransactionController } from './transaction.controller';
import { AccountServiceImpl } from "../account/account.service";
import { TransactionRepositoryImpl } from "./transaction.dao";
import { AccountRepositoryImpl } from "../account/account.repository";
import { AccountModule } from "../account/account.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionSaveService, TransactionService } from "./transaction.interface";
import { SaveTransactionsImpl } from "./services/save-transaction.service";

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [
    { provide: 'TransactionDAO', useClass: TransactionRepositoryImpl },
    { provide: 'TransactionService', useClass: TransactionServiceImpl },
    { provide: 'TransactionSaveService', useClass: SaveTransactionsImpl },
    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountRepository', useClass: AccountRepositoryImpl },
  ],
})
export class TransactionModule {}
