import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountRepositoryImpl } from './account.repository';
import { AccountServiceImpl } from "./services/account.service";
import { AccountTransactionServiceImpl } from "./services/account-transaction.service";
import { AccountValidationService } from "./account.interface";
import { AccountValidationServiceImpl } from "./services/account-validation.account";

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountTransactionService', useClass: AccountTransactionServiceImpl },
    { provide: 'AccountValidationService', useClass: AccountValidationServiceImpl },
    { provide: 'AccountRepository', useClass: AccountRepositoryImpl },
  ],
})
export class AccountModule {}
