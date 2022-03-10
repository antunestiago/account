import { Module } from '@nestjs/common';
import { AccountServiceImpl } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepositoryImpl } from './account.repository';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    { provide: 'AccountService', useClass: AccountServiceImpl },
    { provide: 'AccountRepository', useClass: AccountRepositoryImpl },
  ],
})
export class AccountModule {}
