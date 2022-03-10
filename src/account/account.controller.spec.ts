import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AccountController', () => {
  let controller: AccountController;

  const fakeAccount = {
    name: 'Fake Name',
    document: '000.000.000-11',
    availableLimit: 1000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
    })
      .useMocker((token) => {
        if (token === 'AccountService') {
          return { createAccount: jest.fn().mockResolvedValue(fakeAccount) };
        }

        if (token === EventEmitter2) {
          return new EventEmitter2();
        }
      })
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return Error:name \\"should not be empty \\" in handleInitializeAccountEvent', async () => {
    const result = await controller.handleInitializeAccountEvent({
      name: '',
      document: '000.000.000-00',
      availableLimit: 1,
    });

    expect(result[0].constraints.isNotEmpty).toBe('name should not be empty');
  });

  it('should return handleInitializeAccountEvent to be success and return Account Payload', async () => {
    const result = await controller.handleInitializeAccountEvent({
      name: 'John Texas',
      document: '000.000.000-00',
      availableLimit: 1,
    });

    expect(result).toBe(fakeAccount);
  });
});
