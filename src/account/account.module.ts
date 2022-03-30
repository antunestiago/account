import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountServiceImpl } from "./services/account.service";
import { AccountTransactionServiceImpl } from "./services/account-transaction.service";
import { AccountValidationService } from "./account.interface";
import { AccountValidationServiceImpl } from "./services/account-validation.account";
import { AccountRepositoryImpl } from "./account.dao";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./entities/account.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [
    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountTransactionService', useClass: AccountTransactionServiceImpl },
    { provide: 'AccountValidationService', useClass: AccountValidationServiceImpl },
    { provide: 'AccountDAO', useClass: AccountRepositoryImpl },
  ],
})
export class AccountModule {}
