import { Test, TestingModule } from '@nestjs/testing';
import { AccountService, AccountServiceImpl } from "./account.service";

import { HttpStatus } from "@nestjs/common";
import { Account } from "../entities/account.entity";
import AccountBuilder from "../entities/account.builder";

describe('AccountService', () => {
  let service: AccountServiceImpl;

  const fakeAccount = new AccountBuilder('000.000.000-01')
    .setName('Ronald')
    .setAvailableLimit(100)
    .build();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountServiceImpl],
    })
      .useMocker((token) => {
        if (token === 'AccountDAO') {
          return {
            findAccountByDocument: jest.fn().mockResolvedValue(fakeAccount),
            create: jest.fn().mockResolvedValue(fakeAccount),
          };
        }
      })
      .compile();

    service = module.get<AccountServiceImpl>(AccountServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a conflict error', async () => {
    await service.createAccount({
      name: 'Teste 1',
      document: '000.000.000-00',
      availableLimit: 1,
    })
      .catch(reject => {
      expect(reject['status']).toBe(HttpStatus.CONFLICT);
    });
  });

});
