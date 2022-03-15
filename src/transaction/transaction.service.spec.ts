import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService, TransactionServiceImpl } from "./transaction.service";
import { BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountService') {
        return {};
      }

      if (token === 'TransactionRepository') {
        return {};
      }
    })
      .compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
