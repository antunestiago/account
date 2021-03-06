import { TransactionValidationService } from "../transaction.interface";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { TransactionDAO } from "../transaction.dao";
import { AccountValidationService } from "../../account/account.interface";
import { ExceptionMessages } from "../../../common/exception-messages.enum";
import { BusinessRuleError } from "../../../common/filters/operational-error.filter";

export class TransactionValidationServiceImpl implements TransactionValidationService{
  constructor(
    @Inject('AccountValidationService') private accountValidationService: AccountValidationService,
    @Inject('TransactionDAO') private transactionDAO: TransactionDAO,
  ) {}

  async transactionIsValid(createTransactionDto: CreateTransactionDto): Promise<boolean> {
    if (!await this.accountsExists(createTransactionDto)) {
      throw new NotFoundException({ message: ExceptionMessages.noAccountFound })
    }

    if (!await this.isNewTransactionTimeCloseToTheLast(createTransactionDto)) {
      throw new BadRequestException({ message: ExceptionMessages.doubleTransaction });
    }

    const enoughFunds = await this.accountValidationService.accountHasSufficientFunds(createTransactionDto.senderDocument,
      createTransactionDto.value);
    if (!enoughFunds) {
      throw new BusinessRuleError([ExceptionMessages.insufficientFunds]);
    }
    return true;
  }

  private async accountsExists(createTransactionDto: CreateTransactionDto): Promise<boolean> {
    const sender = await this.accountValidationService.accountExists(createTransactionDto.senderDocument);
    const receiver = await this.accountValidationService.accountExists(createTransactionDto.receiverDocument);
    return Boolean(sender && receiver);
  }

  private async isNewTransactionTimeCloseToTheLast(createTransactionDto: CreateTransactionDto) {
    const TWO_MINUTES_IN_SECONDS = 120;
    const lastSenderTransaction = await this.transactionDAO.getLastSenderTransaction(createTransactionDto.senderDocument)

    if (!lastSenderTransaction) return true;

    const diff = createTransactionDto.datetime.getTime() - lastSenderTransaction.datetime.getTime();
    return Math.abs(diff) / 1000 > TWO_MINUTES_IN_SECONDS;
  }

}