import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService, TransactionServiceImpl } from "./transaction.service";
import { BadRequestException, HttpStatus } from "@nestjs/common";
import { Account } from "../../account/entities/account.entity";
import { Transaction } from "../entities/transaction.entity";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { ExceptionMessages } from "../../../common/exception-messages.enum";

describe('TransactionService with one of accounts not found', () => {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date();

  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountService') {
        return {
          getAccount: jest.fn().mockReturnValue(undefined)
        };
      }
      if (token === 'TransactionDAO') {
        return {};
      }
    }).compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return NotFoundException with one or more accounts does not exists', () => {
    try {
      service.transferFunds(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
});

describe('TransactionService with duplicated transaction', () => {
  let service: TransactionService;

  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date(2022, 2,15,11,30,48);

  const fakeTransaction = new Transaction();
  fakeTransaction.senderDocument = '000.000.000-01';
  fakeTransaction.receiverDocument = '000.000.000-02';
  fakeTransaction.availableLimit = 700;
  fakeTransaction.datetime = new Date(2022, 2,15,11,30,0);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountService') {
        return {
          // transferFundsBetweenAccounts: jest.fn().mockResolvedValue(fakeAccount),
          getAccount: jest.fn().mockReturnValue(true)
        };
      }

      if (token === 'TransactionDAO') {
        return {
          getLastSenderTransaction: jest.fn().mockReturnValue(fakeTransaction),
        };
      }
    })
      .compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });

  it('should return BadRequestException with Double transaction', async () => {
    try {
      await service.transferFunds(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(ExceptionMessages.doubleTransaction);
    }
  });
});
