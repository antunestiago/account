import { Test, TestingModule } from '@nestjs/testing';
import { AccountServiceImpl } from './account.service';

describe('AccountService', () => {
  let service: AccountServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: 'AccountService', useClass: AccountServiceImpl }],
    }).compile();

    service = module.get<AccountServiceImpl>(AccountServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
