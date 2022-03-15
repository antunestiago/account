import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { APP_FILTER } from "@nestjs/core";
import { OperationalErrorFilter } from "../common/filters/operational-error.filter";

@Module({
  imports: [EventEmitterModule.forRoot(), AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: OperationalErrorFilter,
    },
  ],
})
export class AppModule {}
