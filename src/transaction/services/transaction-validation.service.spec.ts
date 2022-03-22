import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from "@nestjs/common";
import { Transaction } from "../entities/transaction.entity";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { ExceptionMessages } from "../../../common/exception-messages.enum";
import { TransactionValidationService } from "../transaction.interface";
import { TransactionValidationServiceImpl } from "./transaction-validation.service";
import { ErrorType } from "../../../common/filters/operational-error.filter";

describe('Transaction Validation Service with one of accounts not found', () => {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date(2022, 2,15,11,30,0);

  let service: TransactionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidationServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountValidationService') {
        return {
          accountExists: jest.fn().mockResolvedValue(undefined)
        };
      }
      if (token === 'TransactionDAO') {
        return {};
      }
    }).compile();

    service = module.get<TransactionValidationService>(TransactionValidationServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return NotFoundException with one or more accounts does not exists', async () => {
    try {
      await service.transactionIsValid(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.NOT_FOUND);
      expect(e.message).toBe(ExceptionMessages.noAccountFound);
    }
  });
});

describe('Transaction Validation Service with duplicated transactions', () => {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date(2022, 2,15,11,30,0);

  let service: TransactionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidationServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountValidationService') {
        return { accountExists: jest.fn().mockResolvedValue(true) };
      }

      if (token === 'TransactionDAO') {
        const t = new Transaction();
        t.id = 1;
        t.datetime = new Date(2022, 2,15,11,30,0);
        t.senderDocument = '000.000.000-01';
        t.receiverDocument = '000.000.000-02';

        return {
          getLastSenderTransaction: jest.fn().mockResolvedValue(t)
        };
      }
    }).compile();

    service = module.get<TransactionValidationService>(TransactionValidationServiceImpl);
  });

  it('should return BadRequestException with Duplicated transaction.', async () => {
    try {
      await service.transactionIsValid(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(ExceptionMessages.doubleTransaction);
    }
  });
});

describe('Transaction Validation Service with insufficient value', () => {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date(2022, 2,15,11,30,0);

  let service: TransactionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidationServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountValidationService') {
        return {
          accountExists: jest.fn().mockResolvedValue(true),
          accountHasSufficientFunds: jest.fn().mockResolvedValue(false),
        };
      }

      if (token === 'TransactionDAO') {
        const t = new Transaction();
        t.id = 1;
        t.datetime = new Date(2022, 2,16,11,30,0);
        t.senderDocument = '000.000.000-01';
        t.receiverDocument = '000.000.000-02';

        return {
          getLastSenderTransaction: jest.fn().mockResolvedValue(t)
        };
      }
    }).compile();

    service = module.get<TransactionValidationService>(TransactionValidationServiceImpl);
  });

  it('should return BusinessRuleError with Insufficient funds.', async () => {
    try {
      await service.transactionIsValid(createTransactionDto);
    } catch (e) {
      expect(e.errorType).toBe(ErrorType.BusinessRuleError);
      expect(e.message).toBe(ExceptionMessages.insufficientFunds);
    }
  });
});

describe('Transaction Validation Service is valid.', () => {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = '000.000.000-01';
  createTransactionDto.receiverDocument = '000.000.000-02';
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date(2022, 2,15,11,30,0);

  let service: TransactionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidationServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'AccountValidationService') {
        return {
          accountExists: jest.fn().mockResolvedValue(true),
          accountHasSufficientFunds: jest.fn().mockResolvedValue(true),
        };
      }

      if (token === 'TransactionDAO') {
        return {
          getLastSenderTransaction: jest.fn().mockResolvedValue(undefined)
        };
      }
    }).compile();

    service = module.get<TransactionValidationService>(TransactionValidationServiceImpl);
  });

  it('should return True (transaction is valid).', async () => {
    const res = await service.transactionIsValid(createTransactionDto);
    expect(res).toBeTruthy();
  });
});