import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceImpl } from "./transaction.service";
import { BadRequestException, HttpStatus, NotFoundException } from "@nestjs/common";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { TransactionService } from "../transaction.interface";
import AccountBuilder from "../../account/entities/account.builder";
import { Transaction } from "../entities/transaction.entity";

function fakeCreateTransactionDTO() {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.senderDocument = "000.000.000-01";
  createTransactionDto.receiverDocument = "000.000.000-02";
  createTransactionDto.value = 100;
  createTransactionDto.datetime = new Date();
  return createTransactionDto;
}

describe('TransactionService with invalid transaction', () => {
  const createTransactionDto = fakeCreateTransactionDTO();

  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'TransactionValidationService') {
        return {
          transactionIsValid: jest.fn().mockRejectedValue(new NotFoundException())
        };
      }
      if (token === 'AccountTransactionService') {
        return {};
      }
      if (token === 'TransactionSaveService') {
        return {};
      }
    }).compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Error in transaction validation', async () => {
    try {
      await service.transferFunds(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
});

describe('TransactionService with valid transaction', () => {
  const createTransactionDto = fakeCreateTransactionDTO();

  const t = new Transaction();
  t.id = 1;
  t.datetime = new Date(2022, 2,15,11,30,0);
  t.senderDocument = '000.000.000-01';
  t.receiverDocument = '000.000.000-02';

  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'TransactionValidationService') {
        return {
          transactionIsValid: jest.fn().mockResolvedValue(true)
        };
      }
      if (token === 'AccountTransactionService') {
        const acc = new AccountBuilder('000.000.000-01').setName('Lennon').setAvailableLimit(200).build();
        return { transferFundsBetweenAccounts: jest.fn().mockResolvedValue(acc) };
      }
      if (token === 'TransactionSaveService') {
        return { create: jest.fn().mockResolvedValue(t)};
      }
    }).compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });


  it('should be success and return a transaction', async () => {
    const transaction = await service.transferFunds(createTransactionDto);
    expect(transaction).toBe(t);
  });
});

describe('TransactionService with valid transaction but error in AccountTransactionService', () => {
  const createTransactionDto = fakeCreateTransactionDTO();

  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
      ],
    }) .useMocker((token) => {
      if (token === 'TransactionValidationService') {
        return {
          transactionIsValid: jest.fn().mockResolvedValue(true)
        };
      }
      if (token === 'AccountTransactionService') {
        return { transferFundsBetweenAccounts: jest.fn().mockRejectedValue(
          new BadRequestException("undefined error")
          )
        };
      }
      if (token === 'TransactionSaveService') {
        return { create: { }};
      }
    }).compile();

    service = module.get<TransactionService>(TransactionServiceImpl);
  });


  it('should return error in AccountTransactionService.transferFundsBetweenAccounts', async () => {
    try {
      await service.transferFunds(createTransactionDto);
    } catch (e) {
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});

