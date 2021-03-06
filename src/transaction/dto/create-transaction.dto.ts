import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  senderDocument: string;

  @IsNotEmpty()
  receiverDocument: string;

  @IsNotEmpty()
  value: number;

  @Type(() => Date)
  @IsDate()
  datetime: Date;
}
