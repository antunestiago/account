import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  availableLimit: number;

  @Column()
  receiverDocument: string;

  @Column()
  senderDocument: string;

  @Column()
  datetime: Date;
}
