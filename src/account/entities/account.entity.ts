import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class Account {
  @Column()
  name: string;

  @PrimaryColumn()
  document: string;

  @Column()
  availableLimit: number;
}
