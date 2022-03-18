import { Test, TestingModule } from '@nestjs/testing';
import { AccountService, AccountServiceImpl } from "./account.service";
import { Account } from "./entities/account.entity";
import { HttpStatus } from "@nestjs/common";

describe('AccountService', () => {
  let service: AccountServiceImpl;

  const fakeAccount = new Account();
  fakeAccount.name = 'Thomas';
  fakeAccount.document = '000.000.000-11';
  fakeAccount.availableLimit = 0;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountServiceImpl],
    })
      .useMocker((token) => {
        if (token === 'AccountRepository') {
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
