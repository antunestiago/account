import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService, TransactionServiceImpl } from "./services/transaction.service";
import { BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

describe('TransactionController with error in Service layer', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
    }) .useMocker((token) => {
      if (token === 'TransactionService') {
        const exception = new BadRequestException({}, 'Error in service layer')
        return { createAccount: jest.fn().mockRejectedValue(exception) };
      }
      if (token === EventEmitter2) {
        return new EventEmitter2();
      }
    })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
