import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [EventEmitterModule.forRoot(), AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
