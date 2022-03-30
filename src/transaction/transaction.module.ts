import { Module } from '@nestjs/common';
import { TransactionServiceImpl } from "./services/transaction.service";
import { TransactionController } from './transaction.controller';
import { TransactionRepositoryImpl } from "./transaction.dao";
import { AccountRepositoryImpl } from "../account/account.dao";
import { AccountModule } from "../account/account.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionSaveService, TransactionService, TransactionValidationService } from "./transaction.interface";
import { SaveTransactionsImpl } from "./services/save-transaction.service";
import { TransactionValidationServiceImpl } from "./services/transaction-validation.service";
import { AccountServiceImpl } from "../account/services/account.service";
import { AccountTransactionService, AccountValidationService } from "../account/account.interface";
import { AccountValidationServiceImpl } from "../account/services/account-validation.account";
import { AccountTransactionServiceImpl } from "../account/services/account-transaction.service";
import { Account } from "../account/entities/account.entity";

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransactionController],
  providers: [
    { provide: 'TransactionDAO', useClass: TransactionRepositoryImpl },
    { provide: 'TransactionService', useClass: TransactionServiceImpl },
    { provide: 'TransactionSaveService', useClass: SaveTransactionsImpl },
    { provide: 'TransactionValidationService', useClass: TransactionValidationServiceImpl },

    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountValidationService', useClass: AccountValidationServiceImpl },
    { provide: 'AccountTransactionService', useClass: AccountTransactionServiceImpl },
    { provide: 'AccountDAO', useClass: AccountRepositoryImpl },
  ],
})
export class TransactionModule {}
